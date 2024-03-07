const projects_csv_header = `Type of Project(Sponsored/Consultancy),Project Title,Funding Agency,Funding Amount in Inr.,JRF/PHD Scholars,Project Description(100 to 400 words),Names of the PI (comma separated),Names of the Co-PI (comma separated)\n`;

const projects_csv_data = `Consultancy,"Timestamp aware Aberrant Detection and Analysis in Big Visual Data using Deep Learning Architecture",SERB-CRG,4500000,Kuldeep Marotirao Biradar,"The proposed system removes the onus of detecting aberrance situations from the manual operator; and rather, places it on the video surveillance system. The present technologies are fails to recognize aberration in video sequences. These aberrances occur over a small-time window. Thus, recognizing with its timeframe from a big visual data is really challenging task. Hence, our focus is on problems, where we are given a set of nominal training videos samples. Based on these samples need to determine whether or not a test video contains an aberration and what instant it occurs. Similarly, we aim to significantly reduce the time and human effort by automating the task and improving the accuracy by recognizing aberrances with its timestamp. Further, exploit the aberrance activity of the object by modeling the rich motion patterns in selected region, effectively capturing the underlying intrinsic structure they form in the video. Implementation of this system can be beneficial for intelligent agencies, banks, departmental stores, traffic monitoring on highway, airport terminal check-in, sports, medical field, and robotics etc.",Dr. Santosh Kumar Vipparthi,NA\n`;


export { projects_csv_data, projects_csv_header }