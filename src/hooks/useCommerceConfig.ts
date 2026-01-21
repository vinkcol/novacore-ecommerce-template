import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectConfiguration,
    selectConfigurationLoading,
    selectConfigurationError
} from "@/features/configuration/redux/configurationSelectors";
import { fetchConfigurationStart } from "@/features/configuration/redux/configurationSlice";


/**
 * Custom hook to access commerce configuration with automatic fetching and caching strategy.
 * This hook ensures we don't re-fetch data if it's already available or loading.
 */
export const useCommerceConfig = () => {
    const dispatch = useDispatch();
    const config = useSelector(selectConfiguration);
    const loading = useSelector(selectConfigurationLoading);
    const error = useSelector(selectConfigurationError);

    useEffect(() => {
        // Cache Strategy: Only fetch if we don't have config and aren't currently loading it
        if (!config && !loading) {
            dispatch(fetchConfigurationStart());
        }
    }, [dispatch, config, loading]);

    return {
        config,
        loading,
        error
    };
};
