import { Container, Sprite, Stage, useApp } from '@pixi/react';
import { sanitizeIpfsUrl } from '@rmrk-team/ipfs-utils';
import DOMPurify from 'isomorphic-dompurify';
// import { Skeleton } from './ui/skeleton';
import { Loader2 } from 'lucide-react';
import { Application, Resource, Texture } from 'pixi.js';
import type { ICanvas } from 'pixi.js';
import type { CSSProperties } from 'react';
import React, { useEffect, useMemo } from 'react';
import { useCallback, useState } from 'react';
import useImage from 'use-image';
import { Skeleton } from '../ui/skeleton.js';
import { INHERIT_RENDER_CONTEXT } from './consts.js';

const useObserveElementDimensions = (ref?: React.RefObject<HTMLDivElement>) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      // Depending on the layout, you may need to swap inlineSize with blockSize
      // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
      setWidth(event[0]?.contentBoxSize[0]?.inlineSize || 0);
      setHeight(event[0]?.contentBoxSize[0]?.blockSize || 0);
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

const useGetCanvasStateDimensions = (ref?: React.RefObject<HTMLDivElement>) => {
  const {
    width,
    height,
    isLoading: isLoadingParentDimensions,
  } = useObserveElementDimensions(ref);
  const {
    onResourceLoad,
    isLoading: isLoadingResourceDimensions,
    actualH,
    actualW,
  } = useGetResourceDimensions();

  const isLoading = isLoadingParentDimensions || isLoadingResourceDimensions;

  const aspectRatio = actualW && actualH ? actualW / actualH : 1;

  return { isLoading, height, width: width * aspectRatio, onResourceLoad };
};

//FIXME: This is sometimes extracted before all sprites are rendered, so not all resources are fully loaded inside of canvas, and we end up with incomplete image
const useBackdropImage = (
  allRenderableResources: RMRKAssetPart[],
  enabled = true,
  pixiApp?: Application<ICanvas>,
) => {
  const [bgImage, setBgImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (allRenderableResources) {
      setBgImage(undefined);
    }
  }, [allRenderableResources]);

  // Get image from canvas to apply as a backdrop background
  const extractImage = async (pixiApp: Application<ICanvas>) => {
    const blob = await pixiApp.renderer.extract.image(pixiApp.stage);
    setBgImage(blob.src);
  };

  // Get image from canvas to apply as a backdrop background
  useEffect(() => {
    if (!bgImage && !!pixiApp && enabled) {
      // Wait for the canvas to be rendered
      setTimeout(() => {
        extractImage(pixiApp);
      }, 600);
    }
  }, [pixiApp, enabled, bgImage, extractImage]);

  return bgImage;
};

export type RMRKAssetPart = {
  src: string;
  z: number | [number, number | typeof INHERIT_RENDER_CONTEXT];
  resources?: RMRKAssetPart[];
};

type Props = {
  resources: RMRKAssetPart[];
  customLoadingComponent?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  resizeObserveRef?: React.RefObject<HTMLDivElement>;
  theme?: Record<string | number | symbol, unknown>;
  fillBgWithImageBlur?: boolean;
  loader?: React.ReactNode;
};

export const MultiLayer2DRenderer = ({
  resources,
  customLoadingComponent,
  className,
  style,
  resizeObserveRef,
  theme,
  fillBgWithImageBlur,
  loader,
}: Props) => {
  const [pixiResourceLoadedCount, setPixiResourceLoadedCount] = useState(0);
  const [isAllResourcesLoaded, setIsAllResourcesLoaded] = useState(false);
  const [pixiApp, setPixiApp] = useState<Application<ICanvas>>();

  const allRenderableResources = useMemo(
    () => resources.filter((r) => !!r.src),
    [resources],
  );

  const bgImage = useBackdropImage(
    allRenderableResources,
    fillBgWithImageBlur && isAllResourcesLoaded,
    pixiApp,
  );

  useEffect(() => {
    if (pixiResourceLoadedCount >= allRenderableResources.length) {
      console.log('All resources loaded', {
        pixiResourceLoadedCount,
        allRenderableResourceCount: allRenderableResources.length,
      });
      setIsAllResourcesLoaded(true);
    }
  }, [allRenderableResources.length, pixiResourceLoadedCount]);

  const { onResourceLoad, isLoading, width, height } =
    useGetCanvasStateDimensions(resizeObserveRef);

  // const isLoading = true;

  const onImageLoaded = useCallback(
    (w: number, h: number) => {
      onResourceLoad(w, h);
      setPixiResourceLoadedCount((prev) => prev + 1);
    },
    [onResourceLoad],
  );

  return (
    <>
      {!isAllResourcesLoaded
        ? customLoadingComponent ?? (
            <Skeleton
              className="w-96 h-96 bg-gray-300 flex justify-center items-center"
              style={{
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              {loader}
            </Skeleton>
          )
        : null}

      <div
        style={{
          height: '100%',
          width: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {bgImage && (
          <div
            style={{
              position: 'absolute',
              filter: 'blur(1.5rem)',
              transform: 'scale(1.1)',
              width: '100%',
              height: '100%',
              left: 0,
              top: 0,
            }}
          >
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={bgImage}
                alt="background"
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        )}
        <Stage
          onMount={setPixiApp}
          width={width}
          height={height}
          options={{ backgroundAlpha: 0 }}
          className={`${className}`}
          style={{
            ...style,
            position: 'relative',
            zIndex: 1,
            visibility: isAllResourcesLoaded ? 'visible' : 'hidden',
          }}
        >
          <Container sortableChildren>
            {resources.map((resource, i) => (
              <Layer
                key={`${resource.src}-${i}`}
                {...resource}
                containerPosition={[width / 2, height / 2]}
                onLoad={onImageLoaded}
                stageWidth={width}
                stageHeight={height}
                theme={theme}
              />
            ))}
          </Container>
          <DevExtensionConfig />
        </Stage>
      </div>
    </>
  );
};

// Fix for weird pnpm type issue
// biome-ignore lint/suspicious/noRedeclare: <explanation>
type useImage = (
  url: string,
  crossOrigin?: 'anonymous' | 'use-credentials',
  referrerpolicy?:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url',
) => [HTMLImageElement | undefined, 'loaded' | 'loading' | 'failed'];

const useCreateResourceTexture = (
  src: string,
  onLoad: (w: number, h: number) => void,
  theme?: Record<string | number | symbol, unknown>,
) => {
  const url = sanitizeIpfsUrl(src);
  const [image] = (useImage as unknown as useImage)(url, 'anonymous');

  useEffect(() => {
    if (image) {
      onLoad(image.width, image.height);
    }
  }, [image, onLoad]);
  const [resourceTexture, setResourceTexture] = useState<
    Texture<Resource> | undefined
  >();

  useEffect(() => {
    const downloadImage = async () => {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      const code = await response.text();

      let svgContent: string;

      if (theme && code && contentType?.includes('svg')) {
        svgContent = DOMPurify.sanitize(code, {
          USE_PROFILES: { svg: true, svgFilters: true },
          FORBID_TAGS: ['style'],
          ADD_TAGS: ['use'],
          ADD_URI_SAFE_ATTR: ['xlink:href'],
        });

        const color_1 = (/data-theme_color_1="([^"]+)"/.exec(svgContent) ||
          '')[1];
        const color_2 = (/data-theme_color_2="([^"]+)"/.exec(svgContent) ||
          '')[1];
        const color_3 = (/data-theme_color_3="([^"]+)"/.exec(svgContent) ||
          '')[1];
        const color_4 = (/data-theme_color_4="([^"]+)"/.exec(svgContent) ||
          '')[1];

        svgContent = svgContent
          .replace(
            new RegExp(`fill="${color_1}"`, 'g'),
            `fill="${theme.theme_color_1}"`,
          )
          .replace(
            new RegExp(`fill="${color_2}"`, 'g'),
            `fill="${theme.theme_color_2}"`,
          )
          .replace(
            new RegExp(`fill="${color_3}"`, 'g'),
            `fill="${theme.theme_color_3}"`,
          )
          .replace(
            new RegExp(`fill="${color_4}"`, 'g'),
            `fill="${theme.theme_color_4}"`,
          );

        const svgUrl = URL.createObjectURL(
          new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' }),
        );

        setResourceTexture(Texture.from(svgUrl));
      } else if (image) {
        setResourceTexture(Texture.from(image));
      }
    };

    if (url && theme) {
      downloadImage();
    }

    if (image && !theme) {
      setResourceTexture(Texture.from(image));
    }
  }, [url, image, theme]);

  return resourceTexture;
};

interface ILayer extends RMRKAssetPart {
  containerPosition?: [number, number];
  onLoad: (w: number, h: number) => void;
  stageWidth: number;
  stageHeight: number;
  theme?: Record<string | number | symbol, unknown>;
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
  const resourceTexture = useCreateResourceTexture(src, onLoad, theme);

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
    <Container sortableChildren position={containerPosition} zIndex={zIndex}>
      {resourceTexture && (
        <Sprite
          anchor={1 / 2}
          texture={resourceTexture}
          zIndex={1}
          width={stageWidth}
          height={stageHeight}
        />
      )}
      {childrenZIndex === null && children}
    </Container>
  );

  // The premise here is `childrenZIndex` is exist.
  // If `childrenZIndex` is "INHERIT", it means that the children should be rendered in the same context as the parent.
  // Or it should be rendered in a specified context.
  const specialRenderContext =
    childrenZIndex !== null ? (
      childrenZIndex !== INHERIT_RENDER_CONTEXT ? (
        <Container
          sortableChildren
          position={containerPosition}
          zIndex={childrenZIndex}
        >
          {children}
        </Container>
      ) : (
        children
      )
    ) : null;

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

  return null;
}
