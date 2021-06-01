import Head from "next/head";
// next js will detect this is only used in server side function so will not include in client bundle
import { MongoClient } from "mongodb";
import { Fragment } from "react";

import MeetupList from "../components/meetups/MeetupList";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "First meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/London_Montage_L.jpg/550px-London_Montage_L.jpg",
//     address: "London eye, London",
//     description: "This is a first meetup",
//   },
//   {
//     id: "m2",
//     title: "Second meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg/480px-Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg",
//     address: "Clock tower, London",
//     description: "This is another meetup",
//   },
//   {
//     id: "m3",
//     title: "Third meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/London_Montage_L.jpg/550px-London_Montage_L.jpg",
//     address: "Somewhere in London",
//     description: "And another dummy meetup",
//   },
// ];

function Homepage(props) {
  return (
    <Fragment>
      <Head>
        <title>Meetups home</title>
        <meta
          name="description"
          content="Browse a full list of meetups created with React and stored on MongoDB"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// Next will excute getStaticProps during build pre-render
// can also include code that would normally run on a server eg access file/database

export async function getStaticProps() {
  //do somehting eg fetch data from API
  // should probably export connection logic to another function to avoid copying
  const uri =
    "mongodb+srv://sam:R4tB5HnYENaIkEX7@cluster0.o4hmx.mongodb.net/meetups?retryWrites=true&w=majority";
  const client = await MongoClient.connect(uri);
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  // by defaul find will find all
  const meetups = await meetupsCollection.find().toArray();
  client.close();
  return {
    props: {
      // need to map complex mongodb object structure to get actual props
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    // revalidate will refetch data every x seconds. This is every hour
    // Alternative that will refetch data for every incomoming request is
    // getServerSideProps, which also gives access to req and res objects eg for auth (See 335)
    revalidate: 1,
  };
}
export default Homepage;
