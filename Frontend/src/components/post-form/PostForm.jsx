import React, {useCallback, useState} from 'react'
import { set, useForm } from 'react-hook-form'
import { Button, Input, Select, RTE, ButtonLoader } from '../index'
import service from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({post}) {
    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues: {
            title: post?.title ||  '',
            content: post?.content || '',
            slug: post?.slug || '',
            status: post?.status || 'active',
        }
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const [isLoading, setIsLoading] = useState(false)
    // console.log("Redux userData in PostForm.jsx:", userData);


    const submit = async(data) => {
        setIsLoading(true)
        try {
            if(post){
                const file = data.image[0] ? service.uploadFile(data.image[0]) :null
                if(file){
                    service.deleteFile(post.featuredImage)
                }
                const dbPost = await service.updatePost(post.$id, {...data, featuredImage: file ? file.$id : undefined})
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }else{
                if (!userData || !userData.$id) {
                    console.error("User is not logged in.");
                    return;
                }
                const file = data.image[0] ? await service.uploadFile(data.image[0]) : null
                if(file){
                    const fileId = file.$id
                    data.featuredImage = fileId;
                    const dbPost = await service.createPost({
                        ...data,
                        userId: userData.$id,
                    })
                    if(dbPost){
                        navigate(`/post/${dbPost.$id}`)
                    }
                }
            }
        } catch (error) {
            console.error("Error submitting post:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const slugTransform = useCallback((value) => {
        if(value && typeof value === 'string')
            return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-z\d\s]+/g, '-') //It means if there is anything other then a to z or A to Z or digits or space, then replace it with a hyphen(-)
            .replace(/\s+/g, '-') //we can do this in one line also just remove \s from first regex
            
            return ''
    }, [])

    React.useEffect(() => {
        const subscription = watch((value, {name}) => {
            if(name === 'title'){
                setValue('slug', slugTransform(value.title, {shouldValidate: true}))
            }
        })

        return () =>{
            subscription.unsubscribe()
        }
    }, [watch, slugTransform, setValue])

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap gap-4 p-4 md:p-6">
            <div className="w-full md:w-2/3 space-y-4">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="text-base md:text-lg"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-2"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <div className="mb-2">
                    <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                </div>
            </div>
            <div className="w-full md:w-1/3 space-y-4">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-2"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-2 flex justify-center">
                        <img
                            src={service.getFileView(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg max-h-40 object-contain border shadow"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-2"
                    {...register("status", { required: true })}
                />
                <ButtonLoader 
                    type="submit" 
                    loading={isLoading}
                    bgColor={post ? "bg-green-500" : undefined} 
                    className="w-full shadow-md hover:scale-105 transition-transform"
                >
                    {isLoading ? (post ? "Updating..." : "Submitting...") : (post ? "Update" : "Submit")}
                </ButtonLoader>
            </div>
        </form>
    )
}

export default PostForm
