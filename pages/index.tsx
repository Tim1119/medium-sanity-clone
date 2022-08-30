import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Banner from "../components/Banner";
import Header from "../components/Header";

import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: [Post];
}

function Home({ posts }: Props) {
  
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/fav.png" />
      </Head>
      <Header />
      <Banner />
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-3 md:p-6 ">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="border rounded-lg group cursor-pointer overflow-hidden">
              <img
                src={urlFor(post.mainImage).url()}
                className="h-60 w-full  object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                alt="post-image"
              />
              <div className="flex justify-between p-3 bg-white">
                <div>
                  <p className="text-lg font-bold" >{post.title}</p>
                  <p className="text-xs">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  src={urlFor(post.author.image).url()}
                  className="h-12 w-12 rounded-full"
                  alt="post-user-image"
                />
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default Home;

export const getServerSideProps = async () => {
  const query = `
  *[_type=="post"]{
    _id,
    title,
    author->{
      name,image
    },
    description,
    mainImage,
    slug
  }`;
  const posts = await sanityClient.fetch(query);
  return {
    props: { posts },
  };
};
