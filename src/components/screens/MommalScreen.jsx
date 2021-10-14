import React, { useEffect } from "react";
import { db } from "../../fb/fb";
import FullScreenBox from "../boxes/FullScreenBox";
import { useDocumentData } from "react-firebase-hooks/firestore";
import useSound from "use-sound";
import successSound from "../../assets/sound/success.wav";
import passSound from "../../assets/sound/pass.wav";
import failSound from "../../assets/sound/fail.wav";
import { usePrevious } from "../../hooks/hooks";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { ReactFitty } from "react-fitty";
import Timer from "../utils/Timer";

const MommalScreen = () => {
  const [seqData, loading, error] = useDocumentData(
    db.collection("Groups").doc("0"),
    {
      idField: "docId",
    }
  );
  const [correct] = useSound(successSound);
  const [pass] = useSound(passSound);
  const [fail] = useSound(failSound);
  const prevValue = usePrevious({
    point: seqData ? seqData.momPoints[seqData.momTeam] : 0,
    content: seqData ? seqData.momContent : "",
    fail: seqData ? seqData.momFail : 0,
  });
  const highestScore = seqData ? Math.max(...seqData.momPoints) : 0;
  useEffect(() => {
    if (seqData && seqData.momTime.seconds * 1000 > Date.now()) {
      if (prevValue.point < seqData.momPoints[seqData.momTeam]) {
        console.log("correct");
        correct();
      }
      if (
        prevValue.point > 0 &&
        prevValue.point === seqData.momPoints[seqData.momTeam] &&
        prevValue.content !== seqData.momContent
      ) {
        console.log("pass");
        pass();
      }
      if (prevValue.fail < seqData.momFail) {
        console.log("fail");
        fail();
      }
    }
  }, [prevValue, seqData, correct, pass, fail]);
  return (
    <FullScreenBox>
      {loading && <CircularProgress />}
      {seqData && (
        <Box height="100%" width="100%">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="black"
            color="white"
            width="100%"
            height="10%"
            px={3}
          >
            <Box
              display="flex"
              justifyContent="center"
              fontSize="2rem"
              flex={1.5}
            >
              <Box mr="auto">
                <Timer timeData={seqData.momTime} />
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              fontSize="1.5rem"
              flex={3}
            >
              <Box mx="auto">몸으로 말해요 출제자 페이지</Box>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              fontSize="1.5rem"
              flex={1.5}
            >
              <Box ml="auto">
                최고 기록{" : "}
                {`${highestScore}점 (${
                  highestScore > 0
                    ? seqData.momPoints.indexOf(highestScore) + 1 + "팀"
                    : "--"
                })`}
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            height="80%"
            justifyContent="center"
            alignItems="center"
          >
            <Box width="80%" textAlign="center">
              {seqData.momTeam !== -1 && (
                <Box fontSize="3rem">
                  {seqData.momTeam !== -1 && `${seqData.momTeam + 1} 팀`} 현재
                  점수 : {seqData.momPoints[seqData.momTeam]} 점
                </Box>
              )}
              <ReactFitty maxSize={300}>{seqData.momContent}</ReactFitty>
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="black"
            color="white"
            width="100%"
            height="10%"
            px={3}
            fontSize={50}
          >
            MVP STUDY GROUP
          </Box>
        </Box>
      )}
      {error || (!seqData && <Box>에러 발생 ! URL을 확인해주십시오.</Box>)}
    </FullScreenBox>
  );
};

export default MommalScreen;
