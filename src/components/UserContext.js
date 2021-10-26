import { createContext,/*  useEffect, useState */ } from "react";
// import { auth, firestore } from "../firebase";

export const UserContext = createContext( null );

export function UserContextProvider( { children } )
{
    /* const query = firestore.collection( 'leaderboards' );
    const [ lb, setLb ] = useState( [ null, true ] ); */

    /*  useEffect( () =>
     {
         const [ _user, loading ] = user;
 
         if ( !loading )
         {
             if ( _user )
             {
                 query.where( 'uid', '==', auth.currentUser.uid ).limit( 1 ).get().then( res =>
                 {
                     if ( !res.empty )
                     {
                         res.docs.forEach( doc =>
                         {
                             setLb( [ doc.data(), false ] );
                         } );
                     }
                 } );
             }
         }
     }, [ user, query ] ); */


    return (
        <UserContextProvider value={ 'asd' }>
            { children }
        </UserContextProvider>
    );
}