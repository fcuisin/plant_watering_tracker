import { Text } from "@mantine/core";
import { GetStaticPaths, GetStaticProps } from "next";
import { fetchAPI } from "../../lib/fetchApi";
import { IPlant } from "../../models/plants";

export default function Plant(props: IPlant) {
  console.log(props);
  return <Text>{props.name}</Text>;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const data = await fetchAPI("http://localhost:3000/api/plants", {
    method: "GET",
  });

  const plantData = data.find((plant) => params.id === plant._id);

  return {
    props: plantData,
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPlants = await fetchAPI("http://localhost:3000/api/plants", {
    method: "GET",
  });

  return {
    paths:
      allPlants.map(({ _id }) => {
        return {
          params: {
            id: _id.toString(),
          },
        };
      }) || [],
    fallback: false,
  };
};
