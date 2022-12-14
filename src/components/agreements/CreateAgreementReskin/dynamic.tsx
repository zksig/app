import dynamic from "next/dynamic";

const NoSSRComponent = dynamic(() => import("./kova"), {
  ssr: false,
});

export default function TestsPage(props: any) {
  //@ts-ignore
  return <NoSSRComponent {...props} />;
}