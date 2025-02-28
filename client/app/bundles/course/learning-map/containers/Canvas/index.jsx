import { useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Xwrapper } from 'react-xarrows';
import Levels from '../Levels';
import ArrowOverlay from '../ArrowOverlay';
import ZoomActionElements from '../../components/ZoomActionElements';

const styles = {
  cursorPosition: {
    position: 'absolute',
  },
  transformComponentWrapper: {
    width: '100%',
  },
  wrapper: {
    outline: 'none',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  zoomAnimation: {
    animationTime: 300,
    animationType: 'easeOutCubic',
  },
};

const gateInputSizeThreshold = 5;
const zoomScale = 1.25;
const maxScale = 1.5;
const minScale = 0.25;

const Canvas = () => {
  const transformRef = useRef(null);
  const [scale, setScale] = useState(1);

  const getGateInputId = (isSummaryGate, parentNodeId, childNodeId) =>
    isSummaryGate
      ? `${childNodeId}-summary-gate`
      : `${parentNodeId}-to-${childNodeId}-gate-input`;

  const getGateId = (nodeId) => `${nodeId}-gate`;
  const getGateConnectionPointId = (nodeId) =>
    `${getGateId(nodeId)}-connection-point`;

  const getNodeConnectionPointId = (nodeId) => `${nodeId}-connection-point`;

  const onZoom = (setTransform, isZoomingIn) => {
    const state = transformRef.current.state;
    const newScale = isZoomingIn
      ? Math.min(state.scale * zoomScale, maxScale)
      : Math.max(state.scale / zoomScale, minScale);
    setTransform(state.positionX, state.positionY, newScale);
    setScale(newScale);
  };

  return (
    <TransformWrapper
      doubleClick={{ disabled: true }}
      limitToBounds={false}
      pinch={{ disabled: true }}
      minScale={0.2}
      maxScale={1.5}
      ref={transformRef}
      wheel={{ disabled: true }}
      zoomIn={styles.zoomAnimation}
      zoomOut={styles.zoomAnimation}
    >
      {({ setTransform }) => (
        <>
          <Xwrapper>
            <ZoomActionElements
              zoomIn={() => onZoom(setTransform, true)}
              zoomOut={() => onZoom(setTransform, false)}
            />
            <div style={styles.wrapper}>
              <TransformComponent
                wrapperStyle={styles.transformComponentWrapper}
              >
                <Levels
                  gateInputSizeThreshold={gateInputSizeThreshold}
                  getGateConnectionPointId={getGateConnectionPointId}
                  getGateId={getGateId}
                  getGateInputId={getGateInputId}
                  getNodeConnectionPointId={getNodeConnectionPointId}
                />
                <ArrowOverlay
                  gateInputSizeThreshold={gateInputSizeThreshold}
                  getGateConnectionPointId={getGateConnectionPointId}
                  getGateInputId={getGateInputId}
                  getNodeConnectionPointId={getNodeConnectionPointId}
                  scale={scale}
                />
              </TransformComponent>
            </div>
          </Xwrapper>
        </>
      )}
    </TransformWrapper>
  );
};

export default Canvas;
