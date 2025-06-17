import { useNavigate } from "react-router-dom"
import Button from "../../../containers/Button"
import Input from "../../../containers/Input"
import SideBar from "../../../containers/SideBar"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Templates, { IResume, sampleResume } from "../ChooseTemplate/Templates"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
const Finish = () => {
  const navigate = useNavigate()
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resumeData, setResumeData] = useState<IResume>(() => ({
       ...sampleResume.resume!,
     }));
  const resumeRef = useRef<HTMLDivElement>(null);


const downloadPDF = async () => {
  const original = resumeRef.current;
  if (!original) return;

  try {
    // Create clone with improved cloning
    const clone = original.cloneNode(true) as HTMLElement;

    // Set fixed width for consistent PDF sizing
    const pdfWidth = 794; // A4 width in pixels at 96 DPI
    const scaleFactor = pdfWidth / original.offsetWidth;

    // Enhanced style reset for better PDF fitting
    clone.style.cssText = `
      position: static !important;
      color: #000000 !important;
      margin: 0 !important;
      height: auto !important;
      overflow: visible !important;
      font-size: 15px !important;
      line-height: 1.4 !important;
    `;

    // Recursively apply PDF-optimized styles for better fitting
    const optimizeForPDF = (element: HTMLElement) => {
      // Text optimization for better fitting
      element.style.overflowWrap = "break-word";
      element.style.wordWrap = "break-word";
      element.style.textOverflow = "clip";
      element.style.fontSize = element.style.fontSize || "15px";
      
      // Layout fixes
      element.style.overflow = "visible";
      element.style.float = "none";
      element.style.position = element.style.position === "fixed" || element.style.position === "absolute" ? "static" : element.style.position;

      element.style.animation = "none";
      element.style.transition = "none";
      element.style.opacity = element.style.opacity === "0" ? "1" : element.style.opacity;
      element.style.visibility = "visible";
      element.style.display = element.style.display === "none" ? "block" : element.style.display;
      if (element.tagName === "IMG") {
        element.style.maxWidth = "100%";
        element.style.height = "auto";
      }
      if (element.tagName === "H1") {
        element.style.lineHeight = "1.5";
        element.style.fontSize = "50px";
      }
      if (element.tagName === "H2" || element.tagName === "H3") {
        element.style.lineHeight = "1.5";
        element.style.fontSize = "25px";
        element.style.fontWeight = "700";

      }
      if (element.tagName === "P") {
        element.style.fontSize = "18px";
      }
      Array.from(element.children).forEach(child => {
        if (child instanceof HTMLElement) {
          optimizeForPDF(child);
        }
      });
    };

    optimizeForPDF(clone);

    // Create container with proper sizing
    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed !important;
      width: 100%;
      height: auto !important;
      z-index: -9999 !important;
      overflow: visible !important;
    `;
    
    container.appendChild(clone);
    document.body.appendChild(container);

    // Wait for layout stabilization
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Force reflow and get actual dimensions
    const actualWidth = clone.scrollWidth * scaleFactor;
    const actualHeight = clone.scrollHeight * scaleFactor;

    // Canvas generation with optimal fitting
    const canvas = await html2canvas(clone, {
      scale: 2, // Good balance of quality and performance
      useCORS: true,
      allowTaint: true,
      x: 0,
      y: 0,
      width : actualWidth,
      height : actualHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: false,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('[data-html2canvas-clone]') as HTMLElement;
        if (clonedElement) {
          clonedElement.style.overflow = "visible";
          clonedElement.style.height = "auto";
        }
      }
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
      compress: true
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 0; // 20pt margin
    const contentWidth = pageWidth - (margin * 0);
    const contentHeight = pageHeight - (margin * 0);

    // Calculate dimensions to fit content on page
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Scale to fit within page margins
    const widthRatio = contentWidth / imgWidth;
    const heightRatio = contentHeight / imgHeight;
    const fitRatio = Math.min(widthRatio, heightRatio, 1); // Don't scale up
    
    const fitWidth = imgWidth * fitRatio;
    const fitHeight = imgHeight * fitRatio;
    
    // Center the content
    const xOffset = margin + (contentWidth - fitWidth) / 2;
    const yOffset = margin;

    // Handle multi-page content
    let remainingHeight = fitHeight;
    let sourceY = 0;
    let pageCount = 0;

    while (remainingHeight > 0) {
      if (pageCount > 0) {
        pdf.addPage();
      }

      const pageContentHeight = Math.min(remainingHeight, contentHeight);
      const sourceHeight = (pageContentHeight / fitRatio);
      
      // Create a temporary canvas for this page section
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = imgWidth;
      pageCanvas.height = sourceHeight;
      
      // Draw the section of the original canvas
      pageCtx?.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
      
      const pageImgData = pageCanvas.toDataURL("image/png", 1.0);
      
      pdf.addImage(
        pageImgData,
        "PNG",
        xOffset,
        yOffset,
        fitWidth,
        pageContentHeight,
        undefined,
        "MEDIUM"
      );

      remainingHeight -= pageContentHeight;
      sourceY += sourceHeight;
      pageCount++;
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `resume_${timestamp}.pdf`;
    
    pdf.save(filename);
    console.log(`PDF generated successfully: ${filename}`);
    
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    // Cleanup
    const containers = document.querySelectorAll('[style*="-99999px"]');
    containers.forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
  }
};

     const [tempId, setTempId] = useState(0);
   
   
     
            useEffect(() => {
              const myTempId = JSON.parse(localStorage.getItem('tempId') || "[]")
              const resume = JSON.parse(localStorage.getItem('resumeData') || "null") ?? sampleResume.resume;
          
              if (myTempId) {
                setTempId(myTempId)
                setResumeData(resume)
              }
          
            }, [])
  return (
    <div className="min-h-screen  relative w-full bg-gray-50">
      <div className="grid grid-cols-12 h-full">

        {/* Sidebar */}
        <motion.div
          className="col-span-2 bg-white shadow-md"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SideBar />
        </motion.div>

        {/* Form Section */}
        <motion.div
          className="col-span-6 p-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-6">
            <h1 className="text-4xl text-sky-700 font-bold mb-1">
              Add links to make your resume connectable
            </h1>
            <p className="text-gray-600 text-sky-700">
              Add any relevant personal/professional links.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-2xl">
            <Input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              label="GitHub"
            />
            <Input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              label="LinkedIn"
            />
  
          </div>
        </motion.div>

        {/* Live Preview */}
   <motion.div
          className="col-span-4 shadow-inner"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          
        >
   <div className="sticky top-2 max-h-full">
      <div className=" overflow-y-auto hide-scrollbar rounded">
        <Templates ref={resumeRef} selectedTempId={tempId} resume={{ ...sampleResume, ...resumeData }} />
      </div>
    </div>
            
       
        </motion.div>

        {/* Footer Navigation */}
        <div className="col-span-12 fixed bottom-0 right-0 mb-6 px-10">
          <div className="flex justify-end gap-4 text-lg font-bold">
            <Button
              className="text-sky-600 underline"
              onClick={() => navigate(-1)}
              title="Previous"
            />
            <Button
              onClick={downloadPDF}
              title="Generate Resume"
              className="bg-sky-600 hover:bg-sky-700 text-white rounded-full py-4 px-8 transition-all duration-300"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Finish
