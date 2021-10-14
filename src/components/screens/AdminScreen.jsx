import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db, firestore } from "../../fb/fb";
import FullScreenBox from "../boxes/FullScreenBox";
import Timer, { addMinute } from "../utils/Timer";
import { getSortName, MOMMALS } from "../../assets/MOMMALS";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  title: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  timerBox: {
    fontWeight: "bold",
    fontSize: "5rem",
    width: "100%",
    textAlign: "center",
  },
});

const AdminScreen = () => {
  const seq = "0";
  const classes = useStyles();
  const [seqData, loading] = useDocumentData(db.collection("Groups").doc("0"), {
    idField: "docId",
  });
  const [team, setTeam] = useState(-1);
  const [sort, setSort] = useState("none");
  const [pointPerTime, setPointPerTime] = useState(5);
  const [contents, setContents] = useState([]);
  const handleChange = (e) => {
    switch (e.target.name) {
      case "team":
        setTeam(e.target.value);
        db.collection("Groups")
          .doc(seq)
          .update({
            momContent: `${e.target.value + 1} 팀의 게임을 준비 중입니다.`,
            momTeam: e.target.value,
          });
        break;
      case "sort":
        setSort(e.target.value);
        db.collection("Groups")
          .doc(seq)
          .update({
            momContent: `${getSortName(
              e.target.value
            )} 영역의 문제를 준비 중입니다.`,
          });
        break;
      case "pointPerTime":
        setPointPerTime(e.target.value);
        break;
      default:
        break;
    }
  };
  const [contentIdx, setContentIdx] = useState(0);
  useEffect(() => {
    team === -1 &&
      sort === "none" &&
      db.collection("Groups").doc(seq).update({
        momContent: "준비 중입니다.",
        momState: "ready",
        momTeam: -1,
      });
  }, [sort, team, seq]);
  useEffect(() => {
    setContents(MOMMALS[sort]);
  }, [sort]);
  return (
    <FullScreenBox>
      {loading && <CircularProgress />}
      {seqData && (
        <Box>
          <Box display="flex" width="100%">
            <Paper
              sx={{
                width: "25%",
                margin: 1,
                padding: 1,
              }}
            >
              <Box className={classes.title}>시간 설정</Box>
              <Box className={classes.timerBox}>
                <Timer timeData={seqData.momTime} />
              </Box>
              <Box display="flex" width="100%" justifyContent="center">
                <Button
                  onClick={() =>
                    addMinute(seq, "momTime", seqData.momTime.seconds, -60)
                  }
                >
                  -1분
                </Button>
                <Button
                  onClick={() =>
                    addMinute(seq, "momTime", seqData.momTime.seconds, 60)
                  }
                >
                  +1분
                </Button>
                <Button
                  onClick={() =>
                    addMinute(seq, "momTime", seqData.momTime.seconds, 180)
                  }
                >
                  +3분
                </Button>
              </Box>
            </Paper>
            <Paper
              sx={{
                width: "75%",
                margin: 1,
                padding: 1,
              }}
            >
              <Box className={classes.title}>팀 점수판</Box>
              <Box width="100%" display="flex" mt={5}>
                {seqData.momPoints.map((point, index) => {
                  return (
                    <Box width="25%" key={index}>
                      <Box textAlign="center" fontWeight="bold" fontSize="2rem">
                        {index + 1} 팀
                      </Box>
                      <Box textAlign="center" fontSize="2rem">
                        {point} 점
                      </Box>
                      <Button
                        onClick={() => {
                          const newPointArr = seqData.momPoints.map(
                            (point, idx) => (idx === index ? point + 5 : point)
                          );
                          db.collection("Groups").doc(seq).update({
                            momPoints: newPointArr,
                          });
                        }}
                      >
                        +5점
                      </Button>
                      <Button
                        onClick={() => {
                          const newPointArr = seqData.momPoints.map(
                            (point, idx) => (idx === index ? point - 5 : point)
                          );
                          db.collection("Groups").doc(seq).update({
                            momPoints: newPointArr,
                          });
                        }}
                      >
                        -5점
                      </Button>
                    </Box>
                  );
                })}
              </Box>
              <Box width="100%" display="flex" justifyContent="center">
                <Button
                  onClick={() => {
                    db.collection("Groups")
                      .doc(seq)
                      .update({
                        momPoints: [0, 0, 0, 0],
                      });
                  }}
                >
                  전체 초기화
                </Button>
              </Box>
            </Paper>
          </Box>
          <Box display="flex" width="100%">
            <Paper
              sx={{
                width: "25%",
                margin: 1,
                padding: 1,
              }}
            >
              <Box className={classes.title}>팀 및 종목 설정</Box>
              <Box width="100%" my={2}>
                <FormControl sx={{ my: 1 }} fullWidth>
                  <InputLabel>플레이 팀</InputLabel>
                  <Select
                    name="team"
                    value={team}
                    label="플레이 팀"
                    onChange={handleChange}
                  >
                    <MenuItem value={-1}>팀 선택</MenuItem>
                    <MenuItem value={0}>1팀</MenuItem>
                    <MenuItem value={1}>2팀</MenuItem>
                    <MenuItem value={2}>3팀</MenuItem>
                    <MenuItem value={3}>4팀</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ my: 1 }} fullWidth>
                  <InputLabel>도전 종목</InputLabel>
                  <Select
                    name="sort"
                    value={sort}
                    label="도전 종목"
                    onChange={handleChange}
                  >
                    <MenuItem value={"none"}>종목 선택</MenuItem>
                    <MenuItem value={"practice"}>연습 문제</MenuItem>
                    <MenuItem value={"things"}>사물 ⭐️</MenuItem>
                    <MenuItem value={"sports"}>스포츠 ⭐️</MenuItem>
                    <MenuItem value={"movies"}>영화 ⭐️⭐️</MenuItem>
                    <MenuItem value={"animals"}>동물 ⭐️⭐️</MenuItem>
                    <MenuItem value={"fairyTales"}>동화 ⭐️⭐️⭐️</MenuItem>
                    <MenuItem value={"proverbs"}>속담 ⭐️⭐️⭐️</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ my: 1 }} fullWidth>
                  <InputLabel>배점</InputLabel>
                  <Select
                    name="pointPerTime"
                    value={pointPerTime}
                    label="배점"
                    onChange={handleChange}
                  >
                    <MenuItem value={5}>5점</MenuItem>
                    <MenuItem value={6}>6점</MenuItem>
                    <MenuItem value={7}>7점</MenuItem>
                    <MenuItem value={8}>8점</MenuItem>
                    <MenuItem value={9}>9점</MenuItem>
                    <MenuItem value={10}>10점</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>
            <Paper
              sx={{
                width: "75%",
                margin: 1,
                padding: 1,
              }}
            >
              <Box className={classes.title}>
                문제 출제 (현재 점수 :{" "}
                {team !== -1 ? seqData.momPoints[team] : "--"})
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="3rem"
                fontWeight="bold"
                textAlign="center"
                height="70%"
              >
                {seqData.momContent}
              </Box>
              <Box display="flex" justifyContent="center">
                <Button
                  disabled={
                    seqData.momState === "playing" ||
                    team === -1 ||
                    sort === "none"
                  }
                  onClick={() => {
                    setContentIdx(0);
                    db.collection("Groups")
                      .doc(seq)
                      .update({
                        momState: "playing",
                        momContent: contents[0] ? contents[0] : "끝!",
                      });
                  }}
                >
                  시작
                </Button>
                <Button
                  disabled={seqData.momState === "ready"}
                  onClick={() => {
                    const newPointArr = seqData.momPoints.map((point, index) =>
                      index === team ? point + pointPerTime : point
                    );
                    setContentIdx((val) => val + 1);
                    db.collection("Groups")
                      .doc(seq)
                      .update({
                        momContent: contents[contentIdx + 1]
                          ? contents[contentIdx + 1]
                          : "끝!",
                        momPoints: newPointArr,
                      });
                  }}
                >
                  정답 (+{pointPerTime}점)
                </Button>
                <Button
                  disabled={seqData.momState === "ready"}
                  onClick={() => {
                    setContentIdx((val) => val + 1);
                    db.collection("Groups")
                      .doc(seq)
                      .update({
                        momFail: firestore.FieldValue.increment(1),
                      });
                  }}
                >
                  틀렸어요!
                </Button>
                <Button
                  disabled={seqData.momState === "ready"}
                  onClick={() => {
                    setContentIdx((val) => val + 1);
                    db.collection("Groups")
                      .doc(seq)
                      .update({
                        momContent: contents[contentIdx + 1]
                          ? contents[contentIdx + 1]
                          : "끝!",
                      });
                  }}
                >
                  통과 (+0점)
                </Button>
                <Button
                  disabled={seqData.momState === "ready"}
                  onClick={() => {
                    setContentIdx(0);
                    db.collection("Groups").doc(seq).update({
                      momContent: "준비 중입니다.",
                      momState: "ready",
                      momTeam: -1,
                    });
                    setTeam(-1);
                    setSort("none");
                    setPointPerTime(5);
                  }}
                >
                  종료
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}
    </FullScreenBox>
  );
};

export default AdminScreen;
