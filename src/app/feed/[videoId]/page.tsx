interface PageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;
  return <div>Video Page {videoId} </div>;
};

export default Page;
