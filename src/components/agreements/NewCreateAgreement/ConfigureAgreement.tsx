import * as pdfjsLib from "pdfjs-dist";
import iconNames from "../../common/icons";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
};

const ConfigureAgreement = ({
  pdf,
  onChangePdf,
}: {
  pdf?: Uint8Array;
  onChangePdf: (file: File) => void;
}) => (
  <div>
    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
      <div className="space-y-1 text-center">
        {pdf ? (
          <>
            {iconNames["check"]}
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:text-green-400"
              >
                <span>Change PDF Agreement</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={({ target }) => {
                    if (!target.files) return;
                    onChangePdf(target.files[0]);
                  }}
                />
              </label>
            </div>
          </>
        ) : (
          <>
            {iconNames["addPicture"]}
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 hover:text-purple-500"
              >
                <span>Upload a PDF Agreement</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={({ target }) => {
                    if (!target.files) return;
                    onChangePdf(target.files[0]);
                  }}
                />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
export default ConfigureAgreement;
