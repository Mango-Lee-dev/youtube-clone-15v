import { SubscribedVideosSection } from "../sections/subscribed-videos-section";

export const SubscriptionView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-xs text-muted-foreground">
          Videos from your subscribed channels.
        </p>
      </div>
      <SubscribedVideosSection />
    </div>
  );
};
