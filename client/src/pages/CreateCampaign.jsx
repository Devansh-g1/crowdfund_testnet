import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '', 
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if(exists) {
        setIsLoading(true)
        await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18)})
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Provide valid image URL')
        setForm({ ...form, image: '' });
      }
    })
  }

  return (
    <div className="min-h-screen px-4 sm:px-10">
      {isLoading && <Loader />}

      <div className="w-full max-w-3xl mx-auto bg-background-500 bg-opacity-10 rounded-xl p-6 sm:p-10">
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <h1 className="text-3xl font-bold text-text-50 mb-4">Start a Campaign</h1>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              labelName="Your Name"
              placeholder="Enter your name"
              inputType="text"
              value={form.name}
              handleChange={(e) => handleFormFieldChange('name', e)}
            />
            <FormField
              labelName="Campaign Title"
              placeholder="Write a title"
              inputType="text"
              value={form.title}
              handleChange={(e) => handleFormFieldChange('title', e)}
            />
          </div>

          <FormField
            labelName="Story"
            placeholder="Write your campaign description"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
          />

          <div className="bg-gradient-to-br from-primary-400 to-accent-500 text-center py-4 rounded-lg mb-6">
            <p className="text-[#132310] font-semibold text-lg">
              You will get 100% of the raised amount
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              labelName="Goal Amount"
              placeholder="ETH 0.50"
              inputType="number"
              value={form.target}
              handleChange={(e) => handleFormFieldChange('target', e)}
            />
            <FormField
              labelName="Campaign Deadline"
              placeholder="End Date"
              inputType="date"
              value={form.deadline}
              handleChange={(e) => handleFormFieldChange('deadline', e)}
            />
          </div>

          <FormField
            labelName="Campaign Image"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          />

          <div className="mt-8">
            <CustomButton 
              btnType="submit"
              title="Submit Campaign"
              styles="w-full bg-accent-600 hover:bg-accent-700 transition-colors"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCampaign