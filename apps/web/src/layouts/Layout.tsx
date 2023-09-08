// Global
import { Box, BoxProps, VisuallyHidden } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

type LayoutProps = BoxProps & {
  title: string;
  description?: string;
  openGraphImage?: string;
  preview?: boolean;
  children: React.ReactNode | React.ReactNode[];
};

const Layout = ({ title, description = '', openGraphImage, children, ...rest }: LayoutProps): JSX.Element => {
  const publicUrl = process.env.NEXT_PUBLIC_PUBLIC_URL ? process.env.NEXT_PUBLIC_PUBLIC_URL : '';
  const router = useRouter();
  const { asPath } = router;
  const path = asPath.split(/[?#]/)[0];

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href={`/favicon.png`} />
        {/*
          Necessary Meta tags, including Social tags.
          It's OK if they're empty, same as not printing them.
        */}
        <meta name="description" content={description} />
        <meta property="og:site_name" content="Sitecore Developer Portal" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${publicUrl}${path}`} />
        <meta property="og:image" content={openGraphImage ? `${publicUrl}${openGraphImage}` : `${publicUrl}/api/og?title=${title}&subtitle=${description}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Box as="main" style={{ marginTop: '122px', minHeight: 'calc(100vh - 236px)' }} {...rest}>
        {/* a11y announcement for route changes. */}
        <VisuallyHidden aria-live="polite" aria-atomic="true">{`The ${title} page has loaded.`}</VisuallyHidden>
        {children}
      </Box>
    </>
  );
};

export default Layout;
