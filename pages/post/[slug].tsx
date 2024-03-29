import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Header />

      <img
        src={urlFor(post.mainImage).url()!}
        className="w-full h-40 object-cover"
        alt="post-image"
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-">{post.title}</h1>
        <p className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </p>

        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.mainImage).url()!}
            alt="author-image"
          />
          <p className="font-extralight text-sm ">
            {" "}
            Blog post by{" "}
            <span className="capitalize text-green-600">
              {post.author.name}
            </span>{" "}
            - Published at{" "}
            <span className="capitalize">
              {new Date(post._createdAt).toLocaleString()}
            </span>{" "}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            className="text-justify"
            content={post.body}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props}></h1>
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props}></h1>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ children, href }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 px-5 mx-auto max-w-sm md:max-w-3xl border border-yellow-500" />
      {submitted ? (
        <div className="my-10 mx-auto flex max-w-2xl flex-col bg-yellow-500 p-10 text-white">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment
          </h3>
          <p>Once it has been approved, it will appear below! </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-3 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoy this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="mt-2 py-3" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              type="text"
              placeholder="Your Name"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              type="email"
              placeholder="Your Email"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              rows={8}
              placeholder="Your Comment"
            ></textarea>
          </label>
          <div className="flex flex-col">
            {errors.name && (
              <span className="text-red-500">- The Name Field is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - The Comment Field is required
              </span>
            )}
            {errors.email && (
              <span className="text-red-500">
                - The Email Field is required
              </span>
            )}
          </div>
          <input
            type="submit"
            className="focus:shadow-outline cursor-pointer rounded bg-yellow-500  px-4 py-2 font-bold text-white shadow hover:bg-yellow-400"
          />
        </form>
      )}

      {/* Comments */}
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow  shadow-yellow-500">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => {
          return (
            <div key={comment._id}>
              <p>
                <span className="text-yellow-500">{comment.name}: </span>
                {comment.comment}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug{
            current
        }
    }`;
  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type=="post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author->{
            name,image
        },
        'comments':*[
            _type == "comment" && 
            post._ref == ^._id &&
            approved == true],
        description,
        mainImage,
        slug,
        body}
        `;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
