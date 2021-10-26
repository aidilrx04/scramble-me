import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../firebase";

function DisplayUserAvatar()
{
    const lbRef = firestore.collection( 'leaderboards' );
    const query = lbRef.where( 'uid', '==', auth.currentUser?.uid ?? null );
    const [ profile ] = useCollectionData( query );
    const user = profile ? profile[ 0 ] : {};

    return (
        <div>
            { profile && profile.length > 0 &&
                <div className="user-profile flex p-2 my-5 bg-indigo-200" >
                    <div>
                        <img
                            className="rounded-[50%] overflow-hidden"
                            src={ user.photoURL }
                            alt="userimg"
                            width={ 50 }
                            height={ 50 } />
                    </div>
                    <div className="pl-2">
                        <span className="font-bold block">{ user.username }</span>
                        <span className="text-sm">Score: <span className="font-bold">{ user.score }</span></span>
                    </div>
                </div>
            }
        </div>
    );
}
export default DisplayUserAvatar;