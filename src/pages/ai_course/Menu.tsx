import { useEffect, useState } from 'react';
import styled from "styled-components";
import CourseSelect from './CourseSelect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSearch } from '../SearchContext';
import { RouteCalculator, Point } from './RouteCalculator';

interface ArrayIndex {
  Index: number;
}

const Menu = () => {
  const { coordinates } = useSearch();

  // const { arrayIndex, setArrayIndex } = useState<ArrayIndex>();

  console.log("ai", coordinates);

  const [imageStates, setImageStates] = useState<{
    [key: string]: boolean;
  }>({ car: true, bus: true, metro: true, train: true });
  //https://reactdatepicker.com/#example-range-month-picker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates: [any, any]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  // 클릭이벤트시 박스 추가
  const [courseBoxes, setCourseBoxes] = useState<number>(1);
  const [courseAddBoxHeight, setCourseAddBoxHeight] = useState<number>(206);

  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });

  const handleImageClick = (imageName: string) => {
    if (imageName === 'datePicker' || imageName === 'startDatePicker') {
      // 날짜 선택기의 경우
      setImageStates({
        ...imageStates,
        datePicker: !imageStates.datePicker,
        startDatePicker: !imageStates.startDatePicker,
      });
    } else {
      // 다른 이미지의 경우
      setImageStates({
        ...imageStates,
        [imageName]: !imageStates[imageName],
      });
      if (imageName === 'startDatePicker' && dateRange.endDate !== null) {
        setDateRange({
          startDate: null,
          endDate: null,
        });
      }
    }
  };

  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  // const handleAddCourse = () => {
  //   setCourseAddBoxHeight(courseAddBoxHeight + 50); // 클릭이벤트시 50px씩 높이 증가
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [accommodations, setAccommodations] = useState<string[]>([]);
  const [inputs, setInputs] = useState({
    lodging: ''
  }); const handleAccommodationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      lodging: event.target.value,
    });
  };
  const handleAccommodationSave = () => {
    setAccommodations([...accommodations, inputs.lodging]);
    setInputs({
      ...inputs,
      lodging: '',
    });
    console.log('숙박장소가 저장되었습니다.');
    console.log('저장된 숙박장소:', accommodations);
  };

  // coordinates를 Point 타입의 배열로 변환
  const [points, setPoints] = useState<Point[]>([]);

  // coordinates 배열이 비어 있지 않은 경우에만 최단 경로 계산
  const [result, setResult] = useState<any>(null);

  // coordinates 배열이 변경될 때마다 최단 경로를 다시 계산
  useEffect(() => {
    (async () => {
      if (coordinates.length > 0) {
        const points = coordinates.map(coordinate => ({
          lon: coordinate.x,
          lat: coordinate.y
        }));
        const result = await RouteCalculator(points);
        setResult(result);
      }
    })();
    setCourseAddBoxHeight(206 + coordinates.length * 50);
  }, [coordinates]);

  return (
    <MenuExtend>
      <TitleBox>
        <div style={{ marginLeft: "20px", fontSize: "28px", fontWeight: "bold" }}>AI 코스</div>
      </TitleBox>
      <MainContent>
        <div style={{ marginLeft: "5px", fontSize: "22px", fontWeight: "bold" }}>코스의 계획을 선택해주세요</div>

        <CourseBox>
          <CourseNumber>1</CourseNumber>
          <CourseContent>
            <Question>
              {startDate && endDate && startDate instanceof Date && endDate instanceof Date && endDate !== null ?
                `출발일${startDate.toLocaleDateString()}~${endDate.toLocaleDateString()} (${Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))}박 ${Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1}일)` :
                ""}
            </Question>

            <DatePickerContainer>
              <DatePickerButton onClick={toggleDatePicker}>날짜선택</DatePickerButton>
              {showDatePicker && (
                <div>
                  <DatePicker
                    selected={startDate}
                    onChange={onChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                  />
                  <button onClick={closeDatePicker}>닫기</button>
                </div>
              )}
            </DatePickerContainer>
          </CourseContent>
        </CourseBox>
        <CourseBox>
          <CourseNumber>2</CourseNumber>
          <CourseContent>
            <Question>숙박장소</Question>
            <InputField
              type="text"
              placeholder="숙박장소를 입력하세요"
              value={inputs.lodging}
              onChange={handleAccommodationChange}
            />
            <SaveButton onClick={handleAccommodationSave}>저장</SaveButton>
          </CourseContent>
        </CourseBox>
        <CourseBox>
          <CourseNumber>3</CourseNumber>
          <CourseContent>
            <Question>어떤 이동수단을 이용하실 예정이신가요?</Question>
            <ImageContainer>
              <ClickableImage
                className="Clickable-Image"
                src="/Ai_Image/Car.png"
                alt="Car"
                style={{ filter: imageStates.car ? 'blur(1px)' : 'none', marginLeft: "30px", width: "40px", height: "40px" }}
                onClick={() => handleImageClick('car')}
              />
              <ClickableImage
                className="Clickable-Image"
                src="/Ai_Image/bus.png"
                alt="Bus"
                style={{ filter: imageStates.bus ? 'blur(1px)' : 'none', marginLeft: "30px", width: "40px", height: "40px" }}
                onClick={() => handleImageClick('bus')}
              />
              <ClickableImage
                className="Clickable-Image"
                src="/Ai_Image/train-station.png"
                alt="Metro"
                style={{ filter: imageStates.metro ? 'blur(1px)' : 'none', marginLeft: "30px", width: "40px", height: "40px" }}
                onClick={() => handleImageClick('metro')}
              />
              <ClickableImage
                className="Clickable-Image"
                src="/Ai_Image/Train.png"
                alt="Train"
                style={{ filter: imageStates.train ? 'blur(1px)' : 'none', marginLeft: "30px", width: "40px", height: "40px" }}
                onClick={() => handleImageClick('train')}
              />
            </ImageContainer>
            <NameContainer>
              <ImageName>자가용</ImageName>
              <ImageName>버스</ImageName>
              <ImageName>지하철</ImageName>
              <ImageName>기차</ImageName>
            </NameContainer>
          </CourseContent>
        </CourseBox>
        <CourseAddBox style={{ height: `${courseAddBoxHeight}px` }}>
          <CourseNumber>4</CourseNumber>
          <CourseContent>
            <Question>예정된 장소를 알려주세요.</Question>
            {Array.from({ length: courseBoxes }).map((_, index) => (
              <div key={index}>
                {coordinates.map((coordinate, index) => (
                  <Container key={index}>
                    <PlaceNumber>{index + 1}.</PlaceNumber>
                    <InputField type="text" value={coordinate.place_name} />
                  </Container>
                ))}
              </div>
            ))}
          </CourseContent>
        </CourseAddBox>
        <StyledCourseBox>
          <CourseNumber>최적 경로</CourseNumber>
          {result && (
            <>
              <p style={{ color: 'blue', fontWeight: 'bold' }}>총 거리: {result.length.toFixed(2)} km</p>
              <p style={{ color: 'green', fontWeight: 'bold' }}>경로: {result && result.path.map((point: Point, index: number) => {
                // coordinates 배열에서 현재 좌표와 일치하는 항목 찾기
                const matchingCoordinate = coordinates.find(coordinate => coordinate.x === point.lon && coordinate.y === point.lat);
                // 일치하는 항목이 있는 경우 장소의 이름을 반환, 그렇지 않은 경우 위도와 경도를 반환
                return matchingCoordinate ? matchingCoordinate.place_name : `(${index + 1}: 위도 ${point.lat}, 경도 ${point.lon})`;
              }).join(' -> ')}</p>
            </>
          )}
        </StyledCourseBox>
        <OpenModalButton onClick={openModal}>활동 선택하기</OpenModalButton>
        <CourseSelect isOpen={isModalOpen} onClose={closeModal} />
      </MainContent>
    </MenuExtend>
  );

};
export default Menu;

const MainContent = styled.div`
  display: flex;
    flex-direction: column;
    width: 390px;
    height: calc(100% - 80px);
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar { width: 5px; }
    &::-webkit-scrollbar-thumb {
        background-color: #d3d3d3; 
        border-radius: 6px;
    }
    &::-webkit-scrollbar-track { background-color: #f1f1f1; }

`

const Container = styled.div`
  display: flex;
  align-items: center;
`;
const PlaceNumber = styled.div`
  display: inline-block;
  float:left;
`
const DatePickerContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const DatePickerButton = styled.button`
    width: 290px;
    height: 35px;
    border: none;
    outline: none;
    padding: 5px;
    border-radius: 10px;
    background-color: #007bff;
    color: white;
    font-size: 20px;
    line-height: normal;
    margin-top: 12px;
    margin-left: 12px;
    top: 12
`;

const MenuExtend = styled.div`
    width : 390px;
    height : 100%;
    background-color: white;
    border-left: 0.5px solid black;
    
`;


const TitleBox = styled.div`
    width : 100%;
    height : 70px;
    background-color:white;
    padding-top: 21px;
    margin-bottom : 10px;
    border-bottom : 1px solid black;
`;

const StyledCourseBox = styled.div`
width: 380px;
    height: 100px;
    margin-left: 5px;
    margin-top: 10px;
    border-radius: 20px;
    border: 1px solid #000;
    background: rgba(1, 96, 214, 0.04);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CourseBox = styled.div`
    width: 380px;
    height: 100px;
    display: flex;
    margin-left: 5px;
    margin-top: 10px;
    border-radius: 20px;
    border: 1px solid #000;
    background: rgba(1, 96, 214, 0.04);
`;

const CourseAddBox = styled.div`
    width: 380px;
    height: 206px;
    display: flex;
    margin-left: 5px;
    margin-top: 10px;
    border-radius: 20px;
    border: 1px solid #000;
    background: rgba(1, 96, 214, 0.04);
`;

const CourseContent = styled.div`
    display: flex;
    padding: 10px;
    flex-direction: column;
`;

const CourseNumber = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 22px;
    font-style: normal;
    font-weight: 600;
    margin-top: 30px;
    margin-left: 20px;
`;

const SaveButton = styled.button`
  width: 70px;
  height: 30px;
  margin-top: 10px;
  margin-left: 10px;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border: none;
`;
const InputField = styled.input`
    float: left
    display: inline-block;
    width: 290px;
    height: 40px;
    border: none;
    outline: none;
    margin-top: 5px;
    margin-left: 10px;  
    border-radius: 10px;
    text-align: center;
    font-weight: bold;
    background-color: #E5E5E5;;
`;

const Question = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 5px;
    margin-left: 10px;  
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ClickableImage = styled.img`
  width: 50px;
  height: 50px;
  margin-left: 10px;
  cursor: pointer;
  transition: filter 0.3s ease-in-out;
`;
const NameContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;
const ImageName = styled.div`
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    margin-top: 3px;
    margin-left: 35px;
`;

const OpenModalButton = styled.button`
  width: 300px; 
  height: 50px; 
  background-color: #007bff; 
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  margin-left: 40px;
`;
