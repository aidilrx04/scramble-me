import { auth, firestore, provider } from "../firebase";
import { useHistory, useLocation } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
// import queryString from 'query-string';
// import { useState } from "react";

function SignIn()
{
    const lbRef = firestore.collection( 'leaderboards' );
    const history = useHistory();
    const location = useLocation();
    const [ user ] = useAuthState( auth );
    // const parsedLoc = queryString.parse( location.search );
    //console.log( auth.currentUser );

    // validate user
    //if ( user && !valid ) history.push( parsedLoc.next ?? '/play' );

    function signInWithGoogle()
    {
        auth.signInWithPopup( provider )
            .then( async res =>
            {
                // check if user is already in leaderboard or create new
                console.log( auth.currentUser );
                const lbUser = await lbRef.doc( auth.currentUser.uid ).get();
                const { search } = location;

                console.log( lbUser.exists );

                if ( lbUser.exists === true )
                {
                    history.push( '/play' );
                }
                else
                {
                    history.push( '/setup' + search );
                }
            } )
            .catch( err =>
            {
                console.warn( 'Sign In Cancelled' );
            } );

    }
    return (
        <div className="bg-white p-3">
            <h2 className="text-2xl text-center underline py-3 px-2 ">Sign In To Play! :) </h2>

            {
                user
                    ? <span className="text-center block">Signed In! Redirecting...</span>
                    : <button
                        onClick={ signInWithGoogle }
                        className="block mx-auto my-5 px-3 py-2 rounded border border-black">
                        Sign in with Google
                    </button>
            }
            {/* <SignOut /> */ }
        </div>
    );
}

export default SignIn;