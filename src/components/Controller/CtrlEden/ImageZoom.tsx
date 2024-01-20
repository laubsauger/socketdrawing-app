
import React from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ImageZoom = ({imageUrl}: {imageUrl: string}) => {
  return (
    <TransformWrapper>
      <TransformComponent>
        <img src={imageUrl} alt={imageUrl} />
      </TransformComponent>
    </TransformWrapper>
  );
}

export default ImageZoom