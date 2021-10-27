import React from 'react';

function Loading()
{
    return (
        <div className="h-screen w-screen flex align-center justify-center relative" style={ { backgroundColor: 'whitesmoke' } }>
            <span className="absolute top-[50%] left-[50%]" style={ { transform: 'translate(-50%, -50%)' } }>
                Loading...
            </span>
        </div>
    );
}

export default Loading;
