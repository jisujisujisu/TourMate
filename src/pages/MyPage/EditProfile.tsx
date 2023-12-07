import React, { useState } from 'react';
import styled from "styled-components";
import { useUser } from '../User/UserContext';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';

function EditProfile() {
  const user = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [texts, setTexts] = useState({
    nickname: user?.nickname,
    age: user?.age,
    gender: user?.gender,
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    

    if (user?.uid) {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);

        const updatedData = {
          nickname: texts.nickname,
          age: texts.age,
          gender: texts.gender,
        };

        await updateDoc(userDocRef, updatedData);
        console.log('프로필 업데이트 성공');
        alert('프로필 업데이트 성공');
      } catch (error) {
        console.error('프로필 업데이트 오류:', error);
        alert('프로필 업데이트 오류');
      }
    } else {
      alert('프로필 값이 없습니다.');
    }

    setIsEditing(false);
  };

  const handleTextChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setTexts({
      ...texts,
      [field]: e.target.value,
    });
  };

  return (
    <div>
      {isEditing ? (
        <Save type="button" onClick={handleSaveClick}><SaveImage><img src="/MyPage_Image/save.png"/></SaveImage></Save>
      ) : (
        <Edit type="button" onClick={handleEditClick}><EditImage><img src="/MyPage_Image/edit.png"/></EditImage></Edit>
      )}
      {isEditing ? (
        <div>
          <Profile><Question>이름</Question> 
          <EditAnswer><input type="text" value={texts.nickname} onChange={(e) => handleTextChange('nickname', e)} /></EditAnswer></Profile>
          <Profile><Question>나이</Question>
          <EditAnswer><input type="text" value={texts.age} onChange={(e) => handleTextChange('age', e)} /></EditAnswer></Profile>
          <Profile><Question>성별</Question>
          <EditAnswer><input type="text" value={texts.gender} onChange={(e) => handleTextChange('gender', e)} /></EditAnswer></Profile>
          </div>
      ) : (
        <div>
          <SaveAnswer><p>{user?.nickname}</p></SaveAnswer>
          <SaveAnswer><p>{user?.age}</p></SaveAnswer>
          <SaveAnswer><p>{user?.gender}</p></SaveAnswer>
        </div>
      )}
    </div>
  );
}

const Save = styled.button`
  margin-left: 300px;
  border:none;
`;

const SaveImage = styled.div`
  width: 15px;
  height: 15px;
  padding-right: 20px;
  display: flex;
  background-color: white;
`;

const Edit = styled.button`
  margin-left: 300px;
  border:none;
`;

const EditImage = styled.div`
  width: 15px;
  height: 15px;
  padding-right: 20px;
  display: flex;
  background-color: white;
`;

const Profile = styled.div`
  display: flex;
  margin: 5px auto;
`;

const Question = styled.div`
  margin: 0 auto;
  font-size: 18px;
  font-weight: bold; 
  color: #000000;
`;

const EditAnswer = styled.button`
  margin: 1px auto;
  border: none;
`;

const SaveAnswer = styled.div`
  font-size: 18px;
  font-weight: normal; 
  margin-top: 5px;
  border: none;
`;

export default EditProfile;
