import React, { CSSProperties, useEffect } from 'react';
import { Container, Sprite, Stage, useApp } from '@pixi/react';
import { useCallback, useState } from 'react';
import useImage from 'use-image';
// import { Skeleton } from './ui/skeleton';
import { Loader2 } from 'lucide-react';
import { Resource, Texture } from 'pixi.js';
import { INHERIT_RENDER_CONTEXT } from './consts';
import { Skeleton } from '../ui/skeleton';
import { sanitizeIpfsUrl } from '@rmrk-team/ipfs-utils';
import DOMPurify from 'isomorphic-dompurify';

const useObserveElementDimensions = (ref?: React.RefObject<HTMLDivElement>) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      // Depending on the layout, you may need to swap inlineSize with blockSize
      // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
      setWidth(event[0].contentBoxSize[0].inlineSize);
      setHeight(event[0].contentBoxSize[0].blockSize);
    });

    if (ref?.current) {
      resizeObserver.observe(ref.current);
    }
  }, [ref?.current]);

  const isLoading = width === 0 || height === 0;

  return { width, height, isLoading };
};

const useGetResourceDimensions = () => {
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);

  const onResourceLoad = useCallback((_w: number, _h: number) => {
    setW((prevW) => {
      if (_w > prevW) return _w;
      return prevW;
    });
    setH((prevH) => {
      if (_h > prevH) return _h;
      return prevH;
    });
  }, []);

  const isLoading = w === 0 || h === 0;

  const actualW = w / window.devicePixelRatio;
  const actualH = h / window.devicePixelRatio;

  return { isLoading, actualW, actualH, onResourceLoad };
};

const useGetCanvasSizeResizedToParent = (ref?: React.RefObject<HTMLDivElement>) => {
  const { width, height, isLoading: isLoadingParentDimensions } = useObserveElementDimensions(ref);
  const {
    onResourceLoad,
    isLoading: isLoadingResourceDimensions,
    actualH,
    actualW,
  } = useGetResourceDimensions();

  const isLoading = isLoadingParentDimensions || isLoadingResourceDimensions;

  const aspectRatio = actualW / actualH;

  return { isLoading, height, width: width * aspectRatio, onResourceLoad };
};

export interface IResource {
  src: string;
  z: number | [number, number | typeof INHERIT_RENDER_CONTEXT];
  resources?: IResource[];
}

interface IMultiLayer2DRenderer {
  resources: IResource[];
  customLoadingComponent?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  resizeObserveRef?: React.RefObject<HTMLDivElement>;
  theme?: Record<any, any>;
}

export const MultiLayer2DRenderer = ({
  resources,
  customLoadingComponent,
  className,
  style,
  resizeObserveRef,
  theme,
}: IMultiLayer2DRenderer) => {
  const { onResourceLoad, isLoading, width, height } =
    useGetCanvasSizeResizedToParent(resizeObserveRef);

  console.log('isLoading', {
    isLoading,
    width,
    height,
    resizeObserveRef,
  });

  return (
    <>
      {isLoading
        ? customLoadingComponent ?? (
            <Skeleton className="w-96 h-96 bg-gray-300 flex justify-center items-center">
              <Loader2 className="animate-spin" />
            </Skeleton>
          )
        : null}

      <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0xffffff }}
        className={`object-contain ${isLoading ? 'hidden ' : ''}${className}`}
        style={style}
      >
        <Container sortableChildren>
          {resources.map((resource, i) => (
            <Layer
              key={`${resource.src}-${i}`}
              {...resource}
              containerPosition={[width / 2, height / 2]}
              onLoad={onResourceLoad}
              stageWidth={width}
              stageHeight={height}
              theme={theme}
            />
          ))}
        </Container>
        <DevExtensionConfig />
      </Stage>
    </>
  );
};

interface ILayer extends IResource {
  containerPosition?: [number, number];
  onLoad: (w: number, h: number) => void;
  stageWidth: number;
  stageHeight: number;
  theme?: Record<any, any>;
}

function Layer({
  src,
  z,
  resources,
  containerPosition,
  onLoad,
  stageWidth,
  stageHeight,
  theme,
}: ILayer) {
  const url = sanitizeIpfsUrl(src);
  const [image] = useImage(url, 'anonymous');

  const [resource, setResource] = useState<Texture<Resource> | undefined>();

  useEffect(() => {
    if (image) {
      onLoad(image.width, image.height);
    }
  }, [image, onLoad]);

  useEffect(() => {
    const downloadImage = async () => {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      // const blob = await response.blob();
      const code = await response.text();
      // const objectURL = URL.createObjectURL(blob);

      let svgContent;

      if (theme && code && contentType?.includes('svg')) {
        svgContent = DOMPurify.sanitize(code, {
          USE_PROFILES: { svg: true, svgFilters: true },
          FORBID_TAGS: ['style'],
          ADD_TAGS: ['use'],
          ADD_URI_SAFE_ATTR: ['xlink:href'],
        });

        const color_1 = (/data-theme_color_1="([^"]+)"/.exec(svgContent) || '')[1];
        const color_2 = (/data-theme_color_2="([^"]+)"/.exec(svgContent) || '')[1];
        const color_3 = (/data-theme_color_3="([^"]+)"/.exec(svgContent) || '')[1];
        const color_4 = (/data-theme_color_4="([^"]+)"/.exec(svgContent) || '')[1];

        svgContent = svgContent
          .replace(new RegExp(`fill="${color_1}"`, 'g'), `fill="${theme.theme_color_1}"`)
          .replace(new RegExp(`fill="${color_2}"`, 'g'), `fill="${theme.theme_color_2}"`)
          .replace(new RegExp(`fill="${color_3}"`, 'g'), `fill="${theme.theme_color_3}"`)
          .replace(new RegExp(`fill="${color_4}"`, 'g'), `fill="${theme.theme_color_4}"`);

        const svgUrl = URL.createObjectURL(
          new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' }),
        );

        setResource(Texture.from(svgUrl));
      } else if (image) {
        setResource(Texture.from(image));
      }
    };

    if (url) {
      downloadImage();
    }
  }, [url, image, stageWidth, stageHeight]);

  console.log('image', image);

  const zIndex = typeof z === 'number' ? z : z[0];
  const childrenZIndex = Array.isArray(z) ? z[1] : null;

  const children = resources
    ? resources.map((resource) => {
        // If childrenZIndex is "INHERIT", it means that the children should be rendered in the same context as the parent.
        // So make sure the container position is also inherited.
        const inherit = childrenZIndex === INHERIT_RENDER_CONTEXT;
        const inheritedContainerPosition = inherit ? { containerPosition } : {};

        return (
          <Layer
            {...resource}
            {...inheritedContainerPosition}
            onLoad={onLoad}
            stageWidth={stageWidth}
            stageHeight={stageHeight}
          />
        );
      })
    : null;

  const dependentRenderContext = (
    <>
      <Container sortableChildren position={containerPosition} zIndex={zIndex}>
        {resource && (
          <Sprite
            anchor={1 / 2}
            texture={resource}
            zIndex={1}
            width={stageWidth}
            height={stageHeight}
          />
        )}
        {childrenZIndex === null && children}
      </Container>
    </>
  );

  // The premise here is `childrenZIndex` is exist.
  // If `childrenZIndex` is "INHERIT", it means that the children should be rendered in the same context as the parent.
  // Or it should be rendered in a specified context.
  const specialRenderContext =
    childrenZIndex !== null ? (
      childrenZIndex !== INHERIT_RENDER_CONTEXT ? (
        <Container sortableChildren position={containerPosition} zIndex={childrenZIndex}>
          {children}
        </Container>
      ) : (
        children
      )
    ) : null;

  console.log('resource', resource);

  return (
    <>
      {dependentRenderContext}
      {specialRenderContext}
    </>
  );
}

function DevExtensionConfig() {
  const app = useApp();

  useEffect(() => {
    if (process.env.DEV) {
      window.__PIXI_APP__ = app;
    }
  }, [app]);

  return <></>;
}
