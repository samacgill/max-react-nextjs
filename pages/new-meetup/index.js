import { useRouter } from "next/router";
import Head from "next/head";
import { Fragment } from "react";
import NewMeetupForm from "../../components/meetups/NewMeetupForm";

function NewMeetupPage() {
  const router = useRouter();

  async function addMeetupHandler(enteredMeetupData) {
    // console.log("new-meetup-page", enteredMeetupData);

    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enteredMeetupData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log("data", data);
    // use replace if want to stop them going back
    router.push("/");
  }

  return (
    <Fragment>
      <Head>
        <title>Add new meetup</title>
        <meta
          name="description"
          content="Add your own meetups, creating amazing networking opportunities"
        />
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  );
}
export default NewMeetupPage;
