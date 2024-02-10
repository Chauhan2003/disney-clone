import React, { useEffect } from 'react';
import styled from 'styled-components';
import ImageSlider from './ImageSlider';
import Viewers from './Viewers';
import Recommends from './Recommends';
import NewDisney from './NewDisney';
import Originals from './Originals';
import Trending from './Trending';
import { useDispatch, useSelector } from 'react-redux';
import { setMovies } from '../features/movie/movieSlice';
import { selectUserName } from '../features/user/userSlice';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase';

const Home = () => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  useEffect(() => {
    const moviesRef = ref(database, 'movies');

    const handleSnapshot = (snapshot) => {
      const recommends = [];
      const newDisney = [];
      const originals = [];
      const trending = [];

      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        // console.log(data);
        switch (data.type) {
          case 'recommend':
            recommends.push({ id: childSnapshot.key, ...data });
            break;
          case 'new':
            newDisney.push({ id: childSnapshot.key, ...data });
            break;
          case 'original':
            originals.push({ id: childSnapshot.key, ...data });
            break;
          case 'trending':
            trending.push({ id: childSnapshot.key, ...data });
            break;
        }
      });

      dispatch(setMovies({
        recommend: recommends,
        newDisney: newDisney,
        original: originals,
        trending: trending,
      }));
    };

    const errorHandler = (error) => {
      console.error('Error fetching data from Firebase:', error);
    };

    onValue(moviesRef, handleSnapshot, errorHandler);

    // Clean up the listener when the component unmounts
    return () => off(moviesRef, 'value', handleSnapshot);
  }, [userName]);


  return (
    <Container>
      <ImageSlider />
      <Viewers />
      <Recommends />
      <NewDisney />
      <Originals />
      <Trending />
    </Container>
  );
};

const Container = styled.main`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 65px;
  padding: 0 calc(3.5vw + 5px);

  &:after {
    background: url('/images/home-background.png') center center / cover no-repeat fixed;
    content: '';
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
  }
`;

export default Home;
