import { useHistory } from "react-router";
import { auth } from "../firebase";

function SignOut()
{
    const history = useHistory();

    setTimeout( () =>
    {
        auth.signOut().then( () =>
        {
            history.push( '/signin' );
        } );
    }, 200 );

    return (
        <div className="bg-white text-center p-3">
            Signing out...
            {/* <button onClick={ () => auth.signOut() }>Sign Out</button> */ }
        </div>
    );
}

export default SignOut;