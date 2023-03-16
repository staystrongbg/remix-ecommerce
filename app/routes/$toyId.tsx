import {
  ActionFunction,
  DataFunctionArgs,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "react-router";
// import { useParams } from "@remix-run/react";
import { db } from "~/db";
import type { CatchData } from "@remix-run/react/dist/transition";
import { Form, useCatch } from "@remix-run/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import type { Image, Toy, Comment } from "@prisma/client";

const StyledSpacer = styled.div`
  margin: 2rem;
`;

const StyledToyDetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 85vh;
`;

const StyledToyDetailsWrapper = styled.div`
  flex: 3;
  display: inherit;
  flex-direction: column;
`;

const StyledImageWrapper = styled.div`
  display: inherit;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const StyledImageDisplayContainer = styled.div`
  height: 160px;
  width: 160px;
  max-width: 25vw;
  max-height: 25vw;
  border-radius: 10px;
  padding: 0.5rem;
`;

const StyledImage = styled.div`
  background-size: contain;
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.25s;
`;

const StyledContentContainer = styled.div`
  max-height: 600px;
  flex: 1;
  align-items: center;
  display: inherit;
  flex-direction: column;
  justify-content: start;
`;

const StyledDivider = styled.div`
  height: 1px;
  background-color: #eeeeee;
  width: 100%;
`;

export function CatchBoundary() {
  const { status, statusText, data }: CatchData = useCatch();
  return (
    <div style={{ marginTop: "2rem" }}>
      {status} - {statusText} - {data.message}
    </div>
  );
}

export const loader: LoaderFunction = async ({ params }: DataFunctionArgs) => {
  const data = await db.toy.findUnique({
    where: {
      id: Number.isInteger(Number(params.toyId)) ? Number(params.toyId) : 0,
    },
    include: {
      images: true,
      comments: true,
    },
  });

  if (!data) {
    throw json(
      { message: "Something went wrong :(" },
      {
        status: 404,
      }
    );
  }
  return json(data);
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  //   const comment = form.get("comment");
  const formInputs = Object.fromEntries(form);
  if (formInputs.comment) {
    const data = {
      comment: formInputs.comment.toString(),
      toyId: Number(params.toyId),
    };
    await db.comment.create({ data });
  }

  //redirect to refresh the page with the new toy
  return redirect(`/${params.toyId}/promo`);
};

export default function ToyId() {
  const toy = useLoaderData() as Toy & { images: Image[]; comments: Comment[] };
  const [selectedImage, setSelectedImage] = useState<string>("");
  console.log(toy);
  useEffect(() => {
    if (!selectedImage) {
      if (toy.images) {
        setSelectedImage(toy.images[0].imageSrc);
      }
    }
  }, [toy, selectedImage, setSelectedImage]);

  const getSelectedItem = (itemSrc: string): string => {
    if (itemSrc === selectedImage) {
      return "1px solid black";
    } else {
      return "0px";
    }
  };

  return (
    <>
      <StyledSpacer></StyledSpacer>
      <StyledToyDetailsContainer>
        <StyledToyDetailsWrapper>
          <StyledImageWrapper>
            {toy.images?.map((image, index: number) => {
              return (
                <StyledImageDisplayContainer
                  onClick={() => setSelectedImage(image.imageSrc)}
                  key={index}
                  style={{
                    border: getSelectedItem(image.imageSrc),
                  }}
                >
                  <StyledImage
                    style={{
                      backgroundImage: `url(${image.imageSrc})`,
                    }}
                  ></StyledImage>
                </StyledImageDisplayContainer>
              );
            })}
          </StyledImageWrapper>
          <StyledImage
            style={{
              backgroundImage: `url(${selectedImage})`,
            }}
          ></StyledImage>
          <StyledContentContainer>
            <h3>{toy.name}</h3>
            <h3>${toy.price}.00</h3>
          </StyledContentContainer>
          <StyledDivider></StyledDivider>
          <div>
            <h2>Comments</h2>
            {toy.comments?.map((item, index: number) => (
              <p key={index} style={{ textAlign: "center" }}>
                {item.comment}
              </p>
            ))}
          </div>
          <StyledDivider></StyledDivider>
          <Outlet />
          <Form method="post">
            <h2>Create a Comment to get a Deal</h2>
            <input name="comment" placeholder="Comment..." />
            <button type="submit">Post</button>
          </Form>
        </StyledToyDetailsWrapper>
      </StyledToyDetailsContainer>
    </>
  );
}
