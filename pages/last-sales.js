import React, { useEffect, useState } from "react";
import useSWR from "swr";

export default function LastSalesPage(props) {
  const [sales, setSales] = useState(props.sales);
  //   const [isLoading, setIsLoading] = useState(true);

  const { data, error } = useSWR(
    "https://next-project-dee63-default-rtdb.firebaseio.com/sales.json",
    (url) =>
      fetch(url).then((res) =>
        res.json().then((data) => {
          setSales(data);
          return data;
        })
      )
  );

  //   useEffect(() => {
  //     fetch("https://next-project-dee63-default-rtdb.firebaseio.com/sales.json")
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const transformedSales = Object.keys(data).map((key) => ({
  //           id: key,
  //           ...data[key],
  //         }));

  //         setSales(transformedSales);
  //         setIsLoading(false);
  //       });
  //   }, []);

  if (error) {
    return <div>Error</div>;
  }

  if (!data || !sales) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ul>
        {Object.keys(sales).map((key) => (
          <li key={key}>
            {sales[key].username} - ${sales[key].volume}
          </li>
        ))}
      </ul>
    </>
  );
}

export async function getStaticProps() {
  const response = await fetch(
    "https://next-project-dee63-default-rtdb.firebaseio.com/sales.json"
  );
  const data = await response.json();
  const transformedSales = Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));

  return { props: { sales: transformedSales }, revalidate: 10 };
}
