/**
 * Global application config file
 */
const appConfig = {
  graphqlEndpoint: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
  postsPerPage: 9,
  /**
   * Displays a default Featured Image when a Post does not have one
   */
  archiveDisplayFeaturedImage: true,
  themeColor: 'red',
  /**
   * @type {[key: 'twitterUrl' | 'facebookUrl' | 'instagramUrl' | 'youtubeUrl' | 'githubUrl' | 'linkedinUrl']: string}
   */
  socialLinks: {
    twitterUrl: 'https://twitter.com/wpengine',
    facebookUrl: 'https://www.facebook.com/wpengine',
    instagramUrl: 'https://www.instagram.com/wpengine/',
    youtubeUrl: 'https://youtube.com/wpengine',
    githubUrl: 'https://github.com/wpengine',
    linkedinUrl: 'https://www.linkedin.com/company/wpengine',
  },
};

export default appConfig;
