import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Loading from './components/Loading';
import SignIn from './components/SignIn';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Setup from './components/Setup';
import SignOut from './components/SignOut';
import Play from './components/Play';
// import { UserContext, UserContextProvider } from './components/UserContext';
// import { useContext } from 'react';
import Leaderboard from './components/Leaderboard';

function App()
{

  const [ user, loading ] = useAuthState( auth );

  if ( loading ) return <Loading />;

  return (
    <div id="App">
      {/* <UserContextProvider> */ }
      <Content user={ user } />
      {/* </UserContextProvider> */ }
    </div >
  );
}


function Content( { user } )
{
  /*   const [ _user ] = useContext( UserContext );
  
    if ( loading ) return <Loading />; */

  return (
    <BrowserRouter>
      <main>
        <div className="text-center px-2 py-4">
          <h1 className="font-bold text-4xl">Scramble Game!</h1>
          <p>
            <span>By </span>
            <a href="https://github.com/aidilrx04">aidilrx04</a>
          </p>
          <div className="flex justify-center align-center">
            <a href="https://github.com/aidilrx04/scramble-me">
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="Github logo" width={ 17 } height={ 17 } />
            </a>
          </div>
          <div className="flex flex-wrap justify-center align-center my-2">
            <NavBtn to="/">
              Main page
            </NavBtn>
            <NavBtn to="/play">
              Play
            </NavBtn>

            <NavBtn to="/leaderboard">
              Leaderboard
            </NavBtn>

            {
              user ? <NavBtn to="/signout">Sign Out</NavBtn> : <NavBtn to="/signin">SignIn</NavBtn>
            }
          </div>
        </div>

        <div className="w-[600px] max-w-full mx-auto my-2">
          <Switch>
            <Route exact path="/">
              <div className="p-2 bg-white text-center">
                Welcome to Word Scramble -ME

                <p className="font-sm">
                  A scramble game using over <b>15k+ BM words!</b>  collected from <a href="https://wikipedia.org" target="_blank" rel="noreferrer">Wikipedia.org</a>
                </p>
              </div>
            </Route>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/setup">
              <Setup />
            </Route>
            <Route path="/signout">
              <SignOut />
            </Route>
            <Route path="/leaderboard">
              <Leaderboard />
            </Route>
            <Route>
              <Play />
            </Route>

          </Switch>
        </div>
      </main>

    </BrowserRouter>
  );
}




function NavBtn( { children, to } )
{
  if ( !to ) throw new Error( 'to must be a string' );
  return (
    <div className="mx-1 my-1">
      <Link
        to={ to }
        className="p-2 px-3 border border-black rounded block
                   hover:bg-black hover:text-white transition-all
                   active:bg-black active:text-white"
        style={ { borderWidth: '1px' } }>
        { children }
      </Link>
    </div>
  );
}

export default App;