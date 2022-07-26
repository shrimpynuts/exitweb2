import { ICommunity } from '../../types'

export const mockCommunities: Omit<ICommunity, 'created_at' | 'updated_at' | 'id'>[] = [
  {
    name: 'Twitter OGs',
    description: 'For pre-2010 Twitter users.',
    requirement: 'Must post a link to a tweet prior to 2010.',
    icon_image_url: 'https://cdn-icons-png.flaticon.com/512/124/124021.png',
    banner_image_url:
      'https://daocentral.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdaojones%2Fimage%2Fupload%2Fv1637755736%2FCleanShot_2021-11-24_at_04.08.33_pxl0kp.png&w=3840&q=75',
    key: '0x0000000000000000000000000000000000000000',
    slug: 'twitter-ogs',
  },
  {
    name: 'ZK Fans',
    description: 'Made for ZKP enthusiasts.',
    requirement: 'Must have followed @zkp... since before 2020.',
    icon_image_url:
      'https://i0.wp.com/zkproof.org/wp-content/uploads/2021/03/ZK_logo_purple-1.png?fit=3175%2C2682&ssl=1',
    banner_image_url: 'https://wallpaperaccess.com/full/4062573.jpg',
    key: '0x0000000000000000000000000000000000000000',
    slug: 'zk-fans',
  },
  {
    name: '0xParc Community',
    description: 'Members of 0xParc.',
    requirement: '...',
    icon_image_url: 'https://i.imgur.com/kQJepOH.jpg',
    banner_image_url: 'https://s3-us-west-1.amazonaws.com/pioneer-blog/2021/11/0xPARC--1--1.png',
    key: '0x0000000000000000000000000000000000000000',
    slug: '0xparc',
  },
  {
    name: 'Kim Kardashian Fan Club',
    description: 'Keeping up with the kardashians.',
    requirement: 'Must post a link to a comment in the r/KimKardashian sub-reddit.',
    icon_image_url:
      'https://imageio.forbes.com/specials-images/imageserve/5ed57844b14861000600bc5d/0x0.jpg?format=jpg&crop=1080,1080,x0,y0,safe&height=416&width=416&fit=bounds',
    banner_image_url: 'https://wallpaperaccess.com/full/26693.jpg',
    key: '0x0000000000000000000000000000000000000000',
    slug: 'kim-kardashian-fan-club',
  },
  {
    name: 'Bitcoin Core Contributors',
    description: 'Code contributors to the Bitcoin Core Github.',
    requirement: 'Post a link to a Pull Request in the Bitcoin Core Github that was merged before 2020.',
    icon_image_url: 'https://bitcoin.org/img/icons/opengraph.png?1657703267',
    banner_image_url: 'https://wallpaperaccess.com/full/395434.jpg',
    key: '0x0000000000000000000000000000000000000000',
    slug: 'bitcoin-core-contributors',
  },
  {
    name: 'Launch House Members',
    description: 'For members of any LH cohort.',
    requirement: '...',
    icon_image_url: 'https://pbs.twimg.com/profile_images/1428242410644066308/XL5mczlI_400x400.jpg',
    banner_image_url:
      'https://assets-global.website-files.com/611bfc03ac61f57cda0757f2/6228fcd3c0ea82d9f8411a28_lh-wordmark-stacked.jpeg',
    key: '0x0000000000000000000000000000000000000000',
    slug: 'launch-house',
  },
  {
    name: 'Rice University Graduates',
    description: 'Undergraduate, graduate, and alumni.',
    requirement: '...',
    icon_image_url:
      'https://brand.rice.edu/sites/g/files/bxs2591/files/2019-08/190308_Rice_Mechanical_Brand_Standards_Logos-2.png',
    banner_image_url: 'https://res.cloudinary.com/hud9ala09/image/upload/v1457042660/qnkwi5hreaa0iiuvekeg.png',
    key: '0x0000000000000000000000000000000000000000',
    slug: 'rice-university',
  },
  {
    name: 'Knitting Enthusiasts',
    description: 'Members of r/knitting.',
    requirement: 'Must post a link to their profile on r/knitting.',
    icon_image_url: 'https://sarahmaker.com/wp-content/uploads/2022/05/sarahmaker-knit-stitch-15-819x1024.jpg',
    banner_image_url: 'https://cdn.britannica.com/46/123846-050-3E50B317/hat-yarn-skein-knitting-needles.jpg',
    key: '0x0000000000000000000000000000000000000000',
    slug: 'knitting',
  },
  {
    name: 'Ethereum Stack Exchange',
    description: 'Contributors to ethereum.stackexchange.com.',
    requirement: 'Must post a link to their profile on r/knitting.',
    icon_image_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png',
    banner_image_url:
      'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZXRoZXJldW18ZW58MHx8MHx8&w=1000&q=80',
    key: '0x0000000000000000000000000000000000000000',
    slug: 'ethereum-stack-exchange',
  },
  {
    name: 'r/slatestarcodex',
    description: 'In a mad world, all blogging is psychiatry blogging.',
    requirement: 'Must post a link to their profile on r/slatestarcodex.',
    icon_image_url:
      'https://styles.redditmedia.com/t5_30m6u/styles/communityIcon_zpoieg1eyyo11.png?width=256&s=bd83846c54d186812b5c943825a8bf85ff5271aa',
    banner_image_url:
      'https://upload.wikimedia.org/wikipedia/commons/2/2e/SlateStarCodex_screenshot_-_June_22%2C_2020.png',
    key: '0x0000000000000000000000000000000000000000',
    slug: 'slatestarcodex',
  },
  {
    name: 'Stripe Investors',
    description: 'Collison broskis.',
    requirement: '...',
    icon_image_url:
      'https://media-exp1.licdn.com/dms/image/C560BAQF1NNJs-2xA5g/company-logo_200_200/0/1594068219050?e=2147483647&v=beta&t=v7T4H7LBiBKWV0QHIS-NKzpg3PCAp2HU4ohKSG5uCNI',
    banner_image_url:
      'https://images.ctfassets.net/fzn2n1nzq965/3AGidihOJl4nH9D1vDjM84/9540155d584be52fc54c443b6efa4ae6/homepage.png?q=80',
    key: '0x0000000000000000000000000000000000000000',
    slug: 'stripe-investors',
  },
]
