import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = ({meetupData}) => {
  return (
    <>
       <Head>
          <title>{meetupData.title}</title>
          <meta name="description" content={meetupData.description} />
        </Head>
      <MeetupDetail
        image={meetupData.image}
        title={meetupData.title}
        address={meetupData.address}
        description={meetupData.description}
      />
    </>
  );
};

export const getStaticPaths = async () => {
  const client = await MongoClient.connect('mongodb+srv://andrew:Julian.2019!@cluster0.c0ojf.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();

  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({ params: { meetupId: meetup._id.toString() } }))
  }
};

export const getStaticProps = async (context) => {
  const meetupId = context.params.meetupId;

  // fetch data from a single meetup
  const client = await MongoClient.connect('mongodb+srv://andrew:Julian.2019!@cluster0.c0ojf.mongodb.net/meetups?retryWrites=true&w=majority');

  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId)});

  console.log(meetupId);

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description
      }
    }
  }
};

export default MeetupDetails;