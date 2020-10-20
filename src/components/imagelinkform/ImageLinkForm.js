import React from 'react';

const ImageLinkForm = () => {
    return (
        <div>
           <p className="f3">
               {'This Magic Brain will detect faces in pictures. Give it a try!'}
           </p>
           <div className="center">
               <div className="pa4 br3 shadow-5">
                   <input className="f4 pa2 w-70 center" type="text" />
                   <button class="w-30 grow f4 link ph3 pv2 dib white bg-light-purple">Detect</button>
               </div>
               
           </div>
        </div>
    )
}

export default ImageLinkForm;