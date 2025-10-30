// Type declarations for swizzled components
declare module '@theme/MDXContent' {
  import type { ComponentType, ReactNode } from 'react';

  export interface Props {
    children: ReactNode;
  }

  const MDXContent: ComponentType<Props>;
  export default MDXContent;
}

declare module '@theme/DocItem/Content' {
  import type { ReactNode } from 'react';

  export interface Props {
    readonly children: ReactNode;
  }

  export default function DocItemContent(props: Props): ReactNode;
}
