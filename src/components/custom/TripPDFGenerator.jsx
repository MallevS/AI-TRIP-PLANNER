import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TripPDFGenerator = ({ itineraryRef }) => {
  const exportPDF = async () => {
    const canvas = await html2canvas(itineraryRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("trip-plan.pdf");
  };

  return <button onClick={exportPDF} className="bg-cyan-600 text-white px-4 py-2 rounded">Download PDF</button>;
};

export default TripPDFGenerator;
