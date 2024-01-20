import React, { useEffect, useRef } from 'react';
import ReactImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";

const ImageGallery = ({votableResults, onSlideChanged}: {votableResults: any[]|undefined, onSlideChanged: (result: any) => void}) => {
  const ref = useRef(null)

  useEffect(() => {
    if (votableResults) {
      onSlideChanged(votableResults[0])
    }
  }, []);

  if (!votableResults) {
    return (
      <div>No images</div>
    )
  }

  return (
     <ReactImageGallery
       ref={ref}
       items={votableResults.map(image => ({ thumbnail: image.image, original: image.image }))}
       showFullscreenButton={false}
       showPlayButton={false}
       autoPlay={false}
       slideDuration={undefined}
       showBullets={true}
       showNav={true}
       onBeforeSlide={(currentIndex) => {
        onSlideChanged && onSlideChanged(votableResults[currentIndex])
       }}
     />
  )
}

export default ImageGallery