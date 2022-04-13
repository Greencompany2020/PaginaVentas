import { useState } from "react";

const useGraphData = () => {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);

  return { labels, setLabels, datasets, setDatasets };
}

export default useGraphData;
