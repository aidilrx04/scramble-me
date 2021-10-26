import React from 'react';
import { useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { v4 } from 'uuid';
import { firestore } from '../firebase';
import DisplayUserAvatar from './DisplayUserAvatar';

function Leaderboard()
{
    const lbRef = firestore.collection( 'leaderboards' );

    const query = lbRef.orderBy( 'score', 'desc' ).limit( '100' );

    const [ leaderboard ] = useCollectionData( query );

    useEffect( () => console.log( leaderboard ), [ leaderboard ] );

    return (
        <div className="bg-white">
            <h2 className="text-center underline font-bold text-2xl">Leaderboard</h2>

            <DisplayUserAvatar />

            <h3 className="font-bold text-center text-xl">Top 100 Players</h3>

            <table className='w-full box-border lb-table'>
                <thead>
                    <tr>
                        <th className=" px-3 py-3">Username</th>
                        <th className=" px-3 py-3">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        leaderboard && leaderboard.map( ( user, index ) => (
                            <tr key={ v4() }>
                                <td className="flex items-center px-3 py-1">
                                    <div className="pr-2 font-bold">
                                        { index + 1 }
                                    </div>
                                    <div>
                                        <img
                                            className="rounded-[50%]"
                                            src={ user.photoURL }
                                            alt="userimg"
                                            width={ 40 }
                                            height={ 40 } />
                                    </div>
                                    <div className="flex-1 pl-2">
                                        <span className="font-bold">{ user.username }</span>
                                    </div>
                                </td>
                                <td className="text-center">
                                    { user.score }
                                </td>
                            </tr>
                        ) )
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Leaderboard;
