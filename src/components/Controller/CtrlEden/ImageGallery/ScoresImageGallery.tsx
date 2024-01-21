import React, { useEffect, useRef, useState } from 'react';
import ReactImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import './styles.scss'
import { Result } from '../Phases/Voting';
import { observer } from 'mobx-react-lite';

const ScoresImageGallery = ({
  results,
  initialResultInView,
  onSlideChanged
}: {
  results: Result[]|undefined,
  initialResultInView?: Result,
  onSlideChanged: (result: any) => void
}) => {
  const ref = useRef(null)
  const [ sortedResults, setSortedResults ] = useState<Result[]>()

  useEffect(() => {
    if (results) {
      const tempResults = [...results];
      tempResults.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      setSortedResults(tempResults);
    }
  }, [results]);

  if (!sortedResults) {
    return <div>No images</div>
  }

  return (
    <ReactImageGallery
      ref={ref}
      startIndex={initialResultInView ? sortedResults.indexOf(initialResultInView) : 0}
      items={sortedResults.map((image, index) => ({
        thumbnail: image.image,
        original: image.image,
        thumbnailClass: index === 0 ? (
            'voted-result'
          ) : '',
        renderItem: () => (
          <img src={image.image} alt="" />
        ),
        renderThumbInner: () => (
          <div className="image-gallery-thumbnail-inner position-relative h-100">
             <img src={image.image} alt="" className="image-gallery-thumbnail-image" />
            <div className="position-absolute top-0 z-index-above w-100 h-100 d-">
              <div className="image-gallery-thumbnail-label bg-opacity-75 bg-black position-relative align-self-end" style={{ top: '9px' }}><span>Votes:{' '}</span><span className="fw-semibold">{image.votes}</span></div>
              {index === 0 && (
                <div className="image-gallery-thumbnail-label" style={{ position: 'absolute', top: 'initial', bottom: '-9px' }}>Winner!</div>
              )}
            </div>
          </div>
        )
      }))}
      showFullscreenButton={false}
      showPlayButton={false}
      autoPlay={false}
      slideDuration={undefined}
      showBullets={true}
      showNav={true}
      onBeforeSlide={(currentIndex) => {
        onSlideChanged && onSlideChanged(sortedResults[currentIndex])
      }}
    />
  );
};

export default observer(ScoresImageGallery);