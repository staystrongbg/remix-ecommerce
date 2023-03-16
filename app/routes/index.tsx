import Cover from "~/shared/components/Cover";
import ProductGrid from "~/shared/components/ProductGrid";
import styled from "@emotion/styled";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/db";
import { useLoaderData } from "@remix-run/react";
import type { Image, Toy } from "@prisma/client";

const StyledHomeProductContainer = styled.div`
  margin: 1rem 2rem;
`;
export const loader: LoaderFunction = async () => {
  //* Add any backend logic here.
  const data = await db.toy.findMany({
    include: { images: true },
  });
  return json(data, { status: 200 });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <>
      <Cover
        title={"Star Wars Toys"}
        image={
          "https://images.unsplash.com/photo-1608983765214-3fb32be57d29?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80"
        }
      />
      <StyledHomeProductContainer>
        <ProductGrid toys={data} />
      </StyledHomeProductContainer>
    </>
  );
}
