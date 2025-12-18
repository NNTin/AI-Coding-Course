/**
 * Ambient type declarations for Docusaurus @theme/* modules.
 * These modules are generated at build time by Docusaurus and don't have
 * static type definitions available to TSC.
 */

declare module '@theme/DocItem/Paginator' {
  import type { ComponentType } from 'react';
  const DocItemPaginator: ComponentType;
  export default DocItemPaginator;
}

declare module '@theme/DocVersionBanner' {
  import type { ComponentType } from 'react';
  const DocVersionBanner: ComponentType;
  export default DocVersionBanner;
}

declare module '@theme/DocVersionBadge' {
  import type { ComponentType } from 'react';
  const DocVersionBadge: ComponentType;
  export default DocVersionBadge;
}

declare module '@theme/DocItem/Footer' {
  import type { ComponentType } from 'react';
  const DocItemFooter: ComponentType;
  export default DocItemFooter;
}

declare module '@theme/DocItem/TOC/Mobile' {
  import type { ComponentType } from 'react';
  const DocItemTOCMobile: ComponentType;
  export default DocItemTOCMobile;
}

declare module '@theme/DocItem/TOC/Desktop' {
  import type { ComponentType } from 'react';
  const DocItemTOCDesktop: ComponentType;
  export default DocItemTOCDesktop;
}

declare module '@theme/DocBreadcrumbs' {
  import type { ComponentType } from 'react';
  const DocBreadcrumbs: ComponentType;
  export default DocBreadcrumbs;
}

declare module '@theme/ContentVisibility' {
  import type { ComponentType } from 'react';
  import type { DocMetadata } from '@docusaurus/plugin-content-docs';
  interface ContentVisibilityProps {
    metadata: DocMetadata;
  }
  const ContentVisibility: ComponentType<ContentVisibilityProps>;
  export default ContentVisibility;
}

declare module '@theme/DocItem/Layout' {
  import type { ReactNode } from 'react';
  export interface Props {
    children: ReactNode;
  }
}
