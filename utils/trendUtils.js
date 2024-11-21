// Function to calculate trend score (growth rate of trend and news mentions)
export const calculateTrendScore = (trendsData, newsMentions) => {
    if (!trendsData || !trendsData.timeline_data) return 0;
  
    const latestSearchVolume = trendsData.timeline_data[trendsData.timeline_data.length - 1].value;
    const previousSearchVolume = trendsData.timeline_data[trendsData.timeline_data.length - 2].value;
    const growthRate = (latestSearchVolume - previousSearchVolume) / previousSearchVolume;
  
    return (growthRate * 0.7) + (newsMentions * 0.3);
  };
  
  