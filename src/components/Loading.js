import React from 'react';

function Loading()
{
    return (
        <div className="h-screen w-screen flex align-center justify-center relative" style={ { backgroundColor: 'whitesmoke' } }>
            <span className="absolute top-[50%] left-[50%] translate-y-2 ">
                Loading...
            </span>
        </div>
    );
}

export default Loading;
