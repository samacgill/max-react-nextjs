import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";
import MeetupDetail from "../components/meetups/MeetupDetail";

// props come from getstaticprops request for single item from mongodb
function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetup.title}</title>
        <meta name="description" content="{props.meetup.description}" />
      </Head>
      <MeetupDetail
        image={props.meetup.image}
        title={props.meetup.title}
        address={props.meetup.address}
        description={props.meetup.description}
      />
    </Fragment>
  );
}
// If using getStatic props in dynamic page also need getStaticPaths
export async function getStaticPaths() {
  const uri =
    "mongodb+srv://sam:R4tB5HnYENaIkEX7@cluster0.o4hmx.mongodb.net/meetups?retryWrites=true&w=majority";
  const client = await MongoClient.connect(uri);
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  // empty object in first arg will find all
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    // fallback: false assumes we pregenerate all pages
    //can use fallback:true or blocking to just pregenerate popular pages
    // the rest will be generated on the fly, then cache
    // with blocking user won't see anything until finished page is served
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  //fetch data for single meetup
  const uri =
    "mongodb+srv://sam:R4tB5HnYENaIkEX7@cluster0.o4hmx.mongodb.net/meetups?retryWrites=true&w=majority";
  const client = await MongoClient.connect(uri);
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  // need to wrap meetupId wiht ObjectId from mongodb to create complex id object
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });
  client.close();
  return {
    props: {
      meetup: {
        id: selectedMeetup._id.toString(),
        image: selectedMeetup.image,
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
}
export default MeetupDetails;
