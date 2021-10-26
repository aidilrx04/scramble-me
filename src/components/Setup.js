import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { auth, firestore, getTimestamp } from '../firebase';
import queryString from 'query-string';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function Setup()
{
    const [ username, setUsername ] = useState( '' );
    const [ disabled, setDisabled ] = useState( false );
    const lbRef = firestore.collection( 'leaderboards' );
    const [ error, setErr ] = useState( null );
    const location = useLocation();
    const history = useHistory();
    const parsedLoc = queryString.parse( location.search );

    const [ _user ] = useAuthState( auth );
    const [ lb, loading ] = useCollectionData( lbRef.where( 'uid', '==', auth.currentUser?.uid ) );

    // redirect if user isnt sign in yet
    if ( !_user ) history.push( '/signin' + location.search ?? '' );

    // user exists in db, redirect
    if ( lb && lb.length > 0 && username.length === 0 ) history.push( parsedLoc.next ?? '/play' );


    async function registerUser( e )
    {
        e.preventDefault();
        setDisabled( true );
        setErr( null );

        // try find existing username
        const existUsername = await lbRef.where( 'username', '==', username ).get();

        if ( existUsername.empty )
        {
            if ( username !== '' && username.length >= 3 )
            {

                lbRef.doc( auth.currentUser.uid ).set( {
                    uid: auth.currentUser.uid,
                    photoURL: auth.currentUser.photoURL,
                    score: 0,
                    createAt: getTimestamp(),
                    lastUpdate: getTimestamp(),
                    username: username
                } ).then( () =>
                {
                    const redirect = parsedLoc.next ?? '/play';
                    history.push( redirect );

                } ).catch( () =>
                {
                    setErr( 'Failed to register. Please try again. :(' );
                } );

            }
        }
        else
        {
            setErr( 'Username exists! Please try again.' );
        }

        setDisabled( false );

    }
    return (
        <div className="bg-white p-2 ">
            {
                loading
                    ? <Loading />
                    : <>
                        <h2 className="text-2xl px-2 py-3 text-center font-bold underline">Setup</h2>

                        <form onSubmit={ ( e ) => registerUser( e ) }>
                            <label htmlFor="username" className="font-bold text-xl ">Username</label>
                            <input
                                className="block w-full box-border p-1 my-1 border border-gray-900 rounded focus:outline-none"
                                value={ username }
                                onChange={ ( e ) => setUsername( e.target.value ) }
                                type="text"
                                id="username"
                                placeholder="Username"
                                disabled={ disabled }
                            />
                            { error && <span className="bg-red-200 text-red-700 px-2 py-1 block my-1">{ error }</span> }
                            <button disabled={ disabled }
                                className="px-2 py-1 border border-black rounded transition-all
                   hover:bg-black hover:text-white
                   active:bg-black active:text-white
                   disabled:bg-gray-800 disabled:text-white ">
                                { disabled ? 'Registering...' : 'Register now' }
                            </button>
                        </form>
                    </>
            }
        </div>
    );
}

export default Setup;


function Loading()
{
    return (
        <div className="text-center px-2 py-5">
            Loading...
        </div>
    );
}