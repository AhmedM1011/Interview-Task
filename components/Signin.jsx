'use client';
import React, { useState, FormEvent, ChangeEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignUpApi } from '@/Services/Signin.service';
import ApiErrorResponse from '@/Services/ApiErrorResponse';
import { toast } from 'sonner'; 
import emailjs from 'emailjs-com';

const Signin = () => {
    const [first_name, setfname] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState()

    const videoRef = useRef(null);
    const router = useRouter();

    console.log(data,"datatat");
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!first_name || !image) {
            toast.error("Please provide both first name and an image.");
            return;
        }
    
        setLoading(true);
    
        try {
            const timestamp = new Date().toLocaleString();
    
            const form = new FormData();
            form.append('file', image);  
            form.append('first_name', first_name);
            form.append('email', 'ahmedmanegar07@gmail.com');  
            form.append('timestamp', timestamp);  
    
            const response = await SignUpApi(form);
            await setData(response.data.data)
            console.log(response,"response");

            const imageUrl = response?.data?.data?.imagesUrl;
            if (!imageUrl) {
                throw new Error('No image URL found in the API response.');
            }
            
    
            if (response) {
                const emailData = {
                    from_name:"Ahmed",
                    to_name: 'Ibrahim', 
                    first_name: first_name, 
                    timestamp: timestamp, 
                    message: 'A new sign-up has occurred!',
                    attachment: imageUrl,  
                };

                const emailResponse = await emailjs.send(
                    'service_9ha1xyf',  
                    'template_ial6j0t', 
                    emailData,
                    'EqPrCp-3yDv6GUWFs'  
                );
    
                if (emailResponse.status === 200) {
                    toast.success("Sign-up successful and email sent.");
                    router.push('/data');
                } else {
                    throw new Error('Failed to send email.');
                }
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Sign-up successful, but email failed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const startCamera = async () => {
            if (navigator.mediaDevices) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                    }
                } catch (error) {
                    console.error('Camera Error:', error);
                    toast.error('Could not access camera.');
                }
            } else {
                toast.error('Camera not supported.');
            }
        };

        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []); 

    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (context && videoRef.current.videoWidth && videoRef.current.videoHeight) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;

                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        setImage(new File([blob], 'camera-image.png', { type: 'image/png' }));
                    }
                });
            } else {
                toast.error("Video feed is not available for capturing.");
            }
        }
    };

    const deleteImage = () => {
        setImage(null); 
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)} className=" ml-auto mr-auto w-5/6 md:w-3/6 my-12 flex flex-col gap-4">
            <div>
                <h1 className='text-3xl font-semibold'>Signin</h1>
            </div>

            <div className="font-medium gap-1 flex flex-col md:flex-row w-full">
                <div className='basis-2/4 flex flex-col gap-1'>
                    <label htmlFor="">Full Name</label>
                    <input
                        required
                        value={first_name}
                        onChange={(e) => setfname(e.target.value)}
                        placeholder='Enter full name'
                        name='first_name'
                        type="text"
                        className={`w-full outline-none border rounded-md p-3 font-medium`}
                    />
                </div>
            </div>

            <div className="my-4">
                <video
                    ref={videoRef}
                    autoPlay
                    width="100%"   
                    height="200px"  
                    className="border rounded-md"
                />
                <button type="button" onClick={captureImage} className="p-3 bg-green-400 rounded-md mt-4">Capture Image</button>
            </div>

            {image && (
                <div>
                    <img src={URL.createObjectURL(image)} alt="Captured" className="w-32 h-32 object-cover" />
                    <div className="mt-2 flex gap-4">
                        <button type="button" onClick={deleteImage} className="p-3 bg-red-400 rounded-md">Delete Image</button>
                    </div>
                </div>
            )}

            <button type='submit' className="text-center bg-yellow-400 p-3 rounded-md" disabled={loading}>
                {loading ? 'Submitting...' : 'Signin'}
            </button>
        </form>
    );
};

export default Signin;
