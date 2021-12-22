import fs from "fs/promises";
import React, { Fragment } from "react";
import path from "path";

export default function ProductDetailPage(props) {
  const { product } = props;

  // if fallback is false else if "blocking" || true then not needed
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <h1>{product.title}</h1>
      <h1>{product.description}</h1>
    </Fragment>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  const { pid } = params;
  const data = await getData();
  const product = data.products.find((product) => product.id === pid);

  if (!product) {
    // shows 404 page
    return { notFound: true };
  }

  return {
    props: {
      product,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const data = await getData();
  const ids = data.products.map((product) => product.id);
  const pathParams = ids.map((id) => ({ params: { pid: id } }));
  return {
    paths: pathParams,
    // if true then even if an id is not present, we still get a page
    fallback: true,
  };
}
