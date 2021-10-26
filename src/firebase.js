
import firebaseConfig from './firebase.config';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


firebase.initializeApp(
    firebaseConfig
);

const auth = firebase.auth();
const firestore = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

function getTimestamp()
{
    return firebase.firestore.FieldValue.serverTimestamp();
}

function getDocId()
{
    return firebase.firestore.FieldPath.documentId();
}

function getUniqId( ref )
{
    return ref.doc().id;
}

export
{
    auth,
    firestore,
    provider,
    getTimestamp,
    getDocId,
    getUniqId
};