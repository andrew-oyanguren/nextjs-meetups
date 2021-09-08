import Head from 'next/head';
import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';

const HomePage = ({meetups}) => {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta name="description" content="Browse a list of React meetups!" />
      </Head>
      <MeetupList meetups={meetups} />
    </>
  );
};

export const getStaticProps = async () => {
  // fetch data from an API
  // Established connection to Mongodb, including user and password
  const client = await MongoClient.connect('mongodb+srv://andrew:Julian.2019!@cluster0.c0ojf.mongodb.net/meetups?retryWrites=true&w=majority');
  // connects to database
  const db = client.db();
  // searches collections of database to return meetups collection
  const meetupsCollection = db.collection('meetups');
  // Finds the collection and converts it into an array
  const meetups = await meetupsCollection.find().toArray();

  client.close(); // Closes connection to Mongodb

  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString()
      }))
    },
    revalidate: 10
  };
};

// export const getServerSideProps = async (context) => {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   }

// };

export default HomePage;