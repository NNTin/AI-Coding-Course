import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Senior Developer Focused',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Skip the basics and dive deep into advanced AI coding patterns. Designed
        for experienced developers who want to master AI-assisted development.
      </>
    ),
  },
  {
    title: 'Production-Ready Architecture',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Learn design patterns, system integration, and real-world challenges.
        Build maintainable, scalable solutions with AI assistance.
      </>
    ),
  },
  {
    title: 'Comprehensive & Deep',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        From fundamentals to advanced topics with thorough coverage. Master
        prompting, workflows, architecture, security, and performance
        optimization.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
