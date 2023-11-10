import PopupWrapper from "@/components/popup/PopupWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <PopupWrapper />
    </>
  );
}
